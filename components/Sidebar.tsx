
import React from 'react';
import { ToolType } from '../types';
import { 
  Palette, Wand2, Eye, MessageSquare, Menu, X, ZoomIn, Zap, Pencil, 
  ImageMinus, Code2, Languages, FileText, PenTool, Hash, ChefHat, 
  SmilePlus, CloudMoon, GraduationCap,
  // New Icons
  AppWindow, PenBox, Feather, Grid3X3, Sticker, Pipette, Sparkles, 
  Briefcase, Apple, Scale, Map, Dumbbell, Sofa, Shirt, Mic2
} from 'lucide-react';

interface SidebarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool, isOpen, setIsOpen }) => {
  const tools = [
    { id: ToolType.GENERATOR, name: 'Imagine', icon: Palette, desc: 'Generate images' },
    { id: ToolType.SKETCH, name: 'Live Sketch', icon: Pencil, desc: 'Draw to generate' },
    { id: ToolType.EDITOR, name: 'Magic Edit', icon: Wand2, desc: 'Edit & remix' },
    { id: ToolType.BACKGROUND, name: 'Bg Changer', icon: ImageMinus, desc: 'Replace backgrounds' },
    { id: ToolType.ZOOMER, name: 'AI Zoomer', icon: ZoomIn, desc: 'Zoom & enhance' },
    { id: ToolType.ENHANCER, name: 'Enhancer', icon: Zap, desc: 'Upscale quality' },
    { id: ToolType.VISION, name: 'Vision', icon: Eye, desc: 'Analyze images' },
    
    // Design Tools
    { id: ToolType.ICON, name: 'Icon Gen', icon: AppWindow, desc: 'App icons' },
    { id: ToolType.LOGO, name: 'Logo Maker', icon: PenBox, desc: 'Brand logos' },
    { id: ToolType.TATTOO, name: 'Tattoo Art', icon: Feather, desc: 'Ink designs' },
    { id: ToolType.PATTERN, name: 'Pattern Maker', icon: Grid3X3, desc: 'Seamless textures' },
    { id: ToolType.STICKER, name: 'Sticker Maker', icon: Sticker, desc: 'Die-cut stickers' },
    { id: ToolType.PALETTE, name: 'Palette Gen', icon: Pipette, desc: 'Color schemes' },
    { id: ToolType.INTERIOR, name: 'Interior AI', icon: Sofa, desc: 'Redesign rooms' },
    
    // Text & Professional
    { id: ToolType.PROMPT, name: 'Prompt Perfect', icon: Sparkles, desc: 'Refine prompts' },
    { id: ToolType.CODE, name: 'Code Expert', icon: Code2, desc: 'Debug & Write' },
    { id: ToolType.TRANSLATOR, name: 'Translator', icon: Languages, desc: 'Universal translate' },
    { id: ToolType.SUMMARIZER, name: 'Summarizer', icon: FileText, desc: 'Condense text' },
    { id: ToolType.WRITER, name: 'Story Writer', icon: PenTool, desc: 'Creative writing' },
    { id: ToolType.SPEECH, name: 'Speech Writer', icon: Mic2, desc: 'Write speeches' },
    { id: ToolType.LEGAL, name: 'Legal Ease', icon: Scale, desc: 'Simplify contracts' },
    { id: ToolType.INTERVIEW, name: 'Interview Coach', icon: Briefcase, desc: 'Practice Q&A' },
    
    // Lifestyle
    { id: ToolType.SOCIAL, name: 'Social Assist', icon: Hash, desc: 'Viral captions' },
    { id: ToolType.CHEF, name: 'AI Chef', icon: ChefHat, desc: 'Recipe from photo' },
    { id: ToolType.NUTRITION, name: 'Nutritionist', icon: Apple, desc: 'Analyze food stats' },
    { id: ToolType.FITNESS, name: 'Fitness Coach', icon: Dumbbell, desc: 'Workout plans' },
    { id: ToolType.TRAVEL, name: 'Travel Guide', icon: Map, desc: 'Trip itineraries' },
    { id: ToolType.FASHION, name: 'Stylist', icon: Shirt, desc: 'Outfit advice' },
    { id: ToolType.MEME, name: 'Meme Maker', icon: SmilePlus, desc: 'Generate fun' },
    { id: ToolType.DREAM, name: 'Dream Weaver', icon: CloudMoon, desc: 'Interpret dreams' },
    { id: ToolType.STUDY, name: 'Study Buddy', icon: GraduationCap, desc: 'Homework helper' },
    
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
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 border-b border-slate-800 shrink-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Nexus AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">Creative Studio</p>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar pb-20">
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
                <div className={`p-2 rounded-lg mr-3 shrink-0 ${isActive ? 'bg-indigo-600/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                  <Icon size={18} />
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-medium text-sm truncate">{tool.name}</div>
                  <div className="text-[10px] opacity-70 truncate">{tool.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900 z-10">
          <div className="text-xs text-slate-600 text-center">
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
