
import React, { useRef, useState, useEffect } from 'react';
import { generateFromSketch, generateSmartBrushes, SmartBrush } from '../services/geminiService';
import { Pencil, Eraser, Trash2, Download, RefreshCcw, Loader2, PaintBucket, Undo2, Plus, X, Palette } from 'lucide-react';

const LiveSketch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('A cozy cottage in the woods');
  const [isGenerating, setIsGenerating] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'fill'>('pencil');
  
  // Smart Brush State
  const [smartBrushes, setSmartBrushes] = useState<SmartBrush[]>([]);
  const [isLoadingBrushes, setIsLoadingBrushes] = useState(false);
  const [showCustomBrushModal, setShowCustomBrushModal] = useState(false);
  const [newBrushLabel, setNewBrushLabel] = useState('');
  const [newBrushColor, setNewBrushColor] = useState('#ff0000');

  // History State
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  
  // Timers
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const brushDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    initCanvas();
    fetchSmartBrushes(prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch smart brushes when prompt changes (debounced)
  useEffect(() => {
    if (brushDebounceRef.current) clearTimeout(brushDebounceRef.current);
    
    if (prompt.length > 3) {
      setIsLoadingBrushes(true);
      brushDebounceRef.current = setTimeout(() => {
        fetchSmartBrushes(prompt);
      }, 1500); // 1.5s debounce for brushes to avoid spamming while typing
    } else {
      setIsLoadingBrushes(false);
    }
  }, [prompt]);

  const fetchSmartBrushes = async (text: string) => {
    try {
      const brushes = await generateSmartBrushes(text);
      setSmartBrushes(brushes);
      // Automatically select the first brush color if available
      if (brushes.length > 0) {
        setBrushColor(brushes[0].color);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBrushes(false);
    }
  };

  const handleAddCustomBrush = () => {
    if (newBrushLabel && newBrushColor) {
      const newBrush: SmartBrush = { label: newBrushLabel, color: newBrushColor };
      setSmartBrushes(prev => [...prev, newBrush]);
      setBrushColor(newBrushColor);
      setNewBrushLabel('');
      setShowCustomBrushModal(false);
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = 512;
    canvas.height = 512;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      contextRef.current = ctx;
      saveToHistory(ctx);
    }
  };

  const saveToHistory = (ctx = contextRef.current) => {
    if (!ctx || !canvasRef.current) return;
    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      if (newHistory.length >= 20) newHistory.shift();
      return [...newHistory, imageData];
    });
    
    setHistoryStep(prev => {
        const nextStep = prev < 19 ? prev + 1 : 19;
        return nextStep;
    });
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      const previousData = history[newStep];
      if (previousData && contextRef.current) {
        contextRef.current.putImageData(previousData, 0, 0);
        setHistoryStep(newStep);
        triggerGeneration();
      }
    }
  };

  // --- Flood Fill Logic ---
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const floodFill = (startX: number, startY: number, fillColorStr: string) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const { r: tr, g: tg, b: tb } = hexToRgb(fillColorStr);
    const targetColor = { r: tr, g: tg, b: tb, a: 255 };

    const startPos = (startY * width + startX) * 4;
    const startColor = {
      r: data[startPos],
      g: data[startPos + 1],
      b: data[startPos + 2],
      a: data[startPos + 3]
    };

    if (startColor.r === targetColor.r && startColor.g === targetColor.g && 
        startColor.b === targetColor.b && startColor.a === targetColor.a) {
      return;
    }

    const matchStartColor = (pos: number) => {
      return data[pos] === startColor.r &&
             data[pos + 1] === startColor.g &&
             data[pos + 2] === startColor.b &&
             data[pos + 3] === startColor.a;
    };

    const colorPixel = (pos: number) => {
      data[pos] = targetColor.r;
      data[pos + 1] = targetColor.g;
      data[pos + 2] = targetColor.b;
      data[pos + 3] = targetColor.a;
    };

    const stack = [[startX, startY]];

    while (stack.length) {
      const [x, y] = stack.pop()!;
      const pos = (y * width + x) * 4;

      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      
      if (matchStartColor(pos)) {
        colorPixel(pos);
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    saveToHistory();
    triggerGeneration();
  };

  // --- Interaction Handlers ---

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      offsetX: Math.floor((clientX - rect.left) * scaleX),
      offsetY: Math.floor((clientY - rect.top) * scaleY)
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);

    if (tool === 'fill') {
      floodFill(offsetX, offsetY, brushColor);
      return;
    }
    
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !contextRef.current) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    saveToHistory();
    triggerGeneration();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setGeneratedImage(null);
      saveToHistory(ctx);
    }
  };

  const triggerGeneration = () => {
    if (!prompt.trim()) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      await generate();
    }, 800);
  };

  const generate = async () => {
    if (!canvasRef.current) return;
    
    setIsGenerating(true);
    try {
      const base64Sketch = canvasRef.current.toDataURL('image/png');
      const result = await generateFromSketch(base64Sketch, prompt, smartBrushes);
      setGeneratedImage(result);
    } catch (error) {
      console.error("Sketch generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool === 'eraser' ? 'white' : brushColor;
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize, tool]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Live Sketch</h2>
        <p className="text-slate-400">
          Paint with "meanings". Select a semantic brush, draw, and the AI will interpret your colors.
        </p>
      </div>

      {/* Prompt Input */}
      <div className="relative z-20">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your scene (e.g. A mountain lake at sunset)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="absolute right-2 top-2 flex items-center gap-2">
          {isLoadingBrushes && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-slate-400 text-sm">
              <Loader2 size={14} className="animate-spin" /> Generating Brushes...
            </div>
          )}
          <button 
            onClick={() => triggerGeneration()}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
          </button>
        </div>
      </div>

      {/* Smart Palette Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
           <span className="text-sm font-semibold text-slate-400 flex items-center gap-2">
             <Palette size={16} /> Smart Palette (Click to Paint)
           </span>
           <button 
             onClick={() => setShowCustomBrushModal(true)}
             className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
           >
             <Plus size={14} /> Add Brush
           </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {smartBrushes.map((brush, idx) => (
            <button
              key={idx}
              onClick={() => {
                setBrushColor(brush.color);
                setTool(tool === 'eraser' ? 'pencil' : tool);
              }}
              className={`
                flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all whitespace-nowrap
                ${brushColor === brush.color && tool !== 'eraser'
                  ? 'bg-slate-700 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'}
              `}
            >
              <span 
                className="w-6 h-6 rounded-full border border-white/10" 
                style={{ backgroundColor: brush.color }}
              ></span>
              <span className={`text-sm font-medium ${brushColor === brush.color && tool !== 'eraser' ? 'text-white' : 'text-slate-300'}`}>
                {brush.label}
              </span>
            </button>
          ))}
          {smartBrushes.length === 0 && !isLoadingBrushes && (
             <span className="text-sm text-slate-500 italic px-2">Type a prompt above to generate smart brushes...</span>
          )}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
           {/* Tool Toggle */}
           <div className="flex bg-slate-800 rounded-lg p-1">
            <button 
              onClick={() => setTool('pencil')}
              className={`p-2 rounded-md transition-colors ${tool === 'pencil' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Pencil"
            >
              <Pencil size={18} />
            </button>
            <button 
               onClick={() => setTool('eraser')}
               className={`p-2 rounded-md transition-colors ${tool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
               title="Eraser"
            >
              <Eraser size={18} />
            </button>
            <button 
               onClick={() => setTool('fill')}
               className={`p-2 rounded-md transition-colors ${tool === 'fill' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
               title="Fill Bucket"
            >
              <PaintBucket size={18} />
            </button>
          </div>

          <div className="h-8 w-px bg-slate-700 mx-2"></div>

          {/* Current Color Indicator (Manual) */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <input 
                type="color" 
                value={brushColor} 
                onChange={(e) => { 
                  setBrushColor(e.target.value); 
                  if (tool === 'eraser') setTool('pencil');
                }}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none opacity-0 absolute inset-0 z-10"
              />
               <div 
                 className="w-8 h-8 rounded border border-slate-600 shadow-sm"
                 style={{ backgroundColor: brushColor }}
               ></div>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">Manual Color</span>
          </div>
          
          {/* Size Slider */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Size</span>
            <input 
              type="range" 
              min="1" 
              max="40" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 accent-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleUndo}
            disabled={historyStep <= 0}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-sm font-medium"
          >
            <Undo2 size={18} /> Undo
          </button>
          <button 
            onClick={clearCanvas}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium hover:bg-slate-800 px-3 py-1.5 rounded-lg"
          >
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </div>

      {/* Canvases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Drawing Canvas */}
        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-xl cursor-crosshair group border-4 border-slate-800">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full touch-none"
          />
          <div className="absolute top-3 left-3 bg-black/10 px-2 py-1 rounded text-xs text-black font-semibold pointer-events-none select-none">
            Input Sketch
          </div>
        </div>

        {/* AI Result */}
        <div className="relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center">
          {generatedImage ? (
            <img src={generatedImage} alt="AI Result" className="w-full h-full object-contain" />
          ) : (
            <div className="text-slate-600 text-center p-6">
              <RefreshCcw size={48} className={`mx-auto mb-4 ${isGenerating ? 'animate-spin opacity-50' : 'opacity-20'}`} />
              <p>{isGenerating ? "Rendering scene..." : "Draw with the semantic brushes!"}</p>
            </div>
          )}
          
          {isGenerating && generatedImage && (
             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-indigo-400" />
             </div>
          )}

          {generatedImage && !isGenerating && (
             <a 
              href={generatedImage} 
              download="nexus-sketch-gen.png"
              className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-indigo-600 text-white p-2 rounded-lg transition-colors backdrop-blur-md"
            >
              <Download size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Custom Brush Modal */}
      {showCustomBrushModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-80 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Add Custom Brush</h3>
              <button onClick={() => setShowCustomBrushModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Brush Name (e.g. Lava)</label>
                <input 
                  type="text" 
                  value={newBrushLabel}
                  onChange={(e) => setNewBrushLabel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={newBrushColor}
                    onChange={(e) => setNewBrushColor(e.target.value)}
                    className="h-10 w-10 rounded bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={newBrushColor}
                    onChange={(e) => setNewBrushColor(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleAddCustomBrush}
                disabled={!newBrushLabel}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Add Brush
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSketch;
