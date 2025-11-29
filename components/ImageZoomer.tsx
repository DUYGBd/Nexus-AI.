
import React, { useState, useRef, useEffect } from 'react';
import { editImage } from '../services/geminiService';
import { ZoomIn, Upload, Loader2, Download, MousePointerClick, RefreshCcw } from 'lucide-react';

const ImageZoomer: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clickCoords, setClickCoords] = useState<{x: number, y: number} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setResultImage(null);
        setClickCoords(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (!sourceImage || loading || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Percentage coordinates relative to displayed image size
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;

    setClickCoords({ x, y });
    setLoading(true);
    setError(null);

    try {
      // 1. Create an off-screen canvas to crop the original image
      const img = new Image();
      img.src = sourceImage;
      await new Promise((resolve) => { img.onload = resolve; });

      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;

      // Define crop size (e.g., 25% of original dimensions) - effective 4x zoom
      const cropWidth = originalWidth * 0.25;
      const cropHeight = originalHeight * 0.25;

      // Calculate center point in natural dimensions
      const centerX = xPercent * originalWidth;
      const centerY = yPercent * originalHeight;

      // Calculate top-left of crop, clamping to bounds
      let cropX = centerX - cropWidth / 2;
      let cropY = centerY - cropHeight / 2;
      
      // Boundary checks
      if (cropX < 0) cropX = 0;
      if (cropY < 0) cropY = 0;
      if (cropX + cropWidth > originalWidth) cropX = originalWidth - cropWidth;
      if (cropY + cropHeight > originalHeight) cropY = originalHeight - cropHeight;

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      // Draw the cropped portion
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight, // Source rectangle
        0, 0, cropWidth, cropHeight          // Destination rectangle
      );

      const croppedBase64 = canvas.toDataURL('image/png');

      // 2. Send to AI to "enhance" and "hallucinate" details
      const prompt = "This is a zoomed in crop of an image. Re-generate this scene in high resolution 4k quality, adding intricate details, sharpening focus, and enhancing textures. Make it look like a professional macro photograph.";
      const url = await editImage(croppedBase64, prompt);
      
      setResultImage(url);
    } catch (err: any) {
      setError("Failed to generate zoom. Try selecting a different area.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSourceImage(null);
    setResultImage(null);
    setClickCoords(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Smart Zoom</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Tap anywhere on your image. The AI will zoom in and reconstruct that area with incredible detail and clarity.
        </p>
      </div>

      {!sourceImage ? (
         <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/30 hover:bg-slate-800/50 rounded-2xl h-96 flex flex-col items-center justify-center cursor-pointer transition-all group"
        >
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Upload size={40} className="text-indigo-400" />
          </div>
          <p className="font-semibold text-xl text-slate-200">Upload Image to Zoom</p>
          <p className="text-slate-500 mt-2">Supports JPG and PNG</p>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* Source Image Viewer */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <MousePointerClick size={16} /> Click to Zoom
              </span>
              <button onClick={reset} className="text-sm text-slate-500 hover:text-white flex items-center gap-1">
                <RefreshCcw size={14} /> Reset
              </button>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-xl group cursor-crosshair">
              <img 
                ref={imageRef}
                src={sourceImage} 
                alt="Source" 
                onClick={handleImageClick}
                className="w-full h-auto object-contain"
              />
              
              {/* Click Indicator Overlay */}
              {clickCoords && (
                <div 
                  className="absolute w-12 h-12 border-2 border-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-ping-once"
                  style={{ left: clickCoords.x, top: clickCoords.y }}
                />
              )}
              
              {loading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="bg-slate-900/90 px-6 py-4 rounded-xl flex items-center gap-3 shadow-2xl border border-slate-700">
                    <Loader2 className="animate-spin text-indigo-400" />
                    <span className="font-medium text-slate-200">Enhancing details...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result View */}
          <div className="space-y-4 flex flex-col">
             <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-400 flex items-center gap-2">
                <ZoomIn size={16} /> AI Enhanced Zoom
              </span>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative min-h-[400px] flex items-center justify-center">
              {resultImage ? (
                <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                  <img src={resultImage} alt="Zoom Result" className="max-w-full max-h-full object-contain" />
                  <a 
                    href={resultImage}
                    download="nexus-zoom.png"
                    className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-105"
                  >
                    <Download size={20} />
                  </a>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-600">
                  <ZoomIn size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Click a spot on the left image<br/>to see the magic happen</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageZoomer;
