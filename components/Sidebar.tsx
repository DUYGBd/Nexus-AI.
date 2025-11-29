
import React from 'react';
import { ToolType } from '../types';
import { Palette, Wand2, Eye, MessageSquare, Menu, X, ZoomIn, Zap, Pencil } from 'lucide-react';

interface SidebarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool, isOpen, setIsOpen }) => {
  const tools = [
    { id: ToolType.GENERATOR, name: 'Imagine', icon: Palette, desc: 'Generate images from text' },
    { id: ToolType.SKETCH, name: 'Live Sketch', icon: Pencil, desc: 'Draw to generate' },
    { id: ToolType.EDITOR, name: 'Magic Edit', icon: Wand2, desc: 'Edit, extend, or remix images' },
    { id: ToolType.ZOOMER, name: 'AI Zoomer', icon: ZoomIn, desc: 'Zoom & enhance details' },
    { id: ToolType.ENHANCER, name: 'Enhancer', icon: Zap, desc: 'Upscale & improve quality' },
    { id: ToolType.VISION, name: 'Vision', icon: Eye, desc: 'Analyze and describe images' },
    { id: ToolType.CHAT, name: 'Assistant', icon: MessageSquare, desc: 'Chat with AI' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white shadow-lg border border-slate-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Nexus AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">Creative Studio</p>
        </div>

        <nav className="p-4 space-y-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}
                `}
              >
                <div className={`p-2 rounded-lg mr-3 ${isActive ? 'bg-indigo-600/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                  <Icon size={20} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-xs opacity-70">{tool.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <div className="text-xs text-slate-500 text-center">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;