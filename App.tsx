
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import VisionTool from './components/VisionTool';
import ChatTool from './components/ChatTool';
import ImageZoomer from './components/ImageZoomer';
import ImageEnhancer from './components/ImageEnhancer';
import LiveSketch from './components/LiveSketch';
import { ToolType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.GENERATOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.GENERATOR:
        return <ImageGenerator />;
      case ToolType.SKETCH:
        return <LiveSketch />;
      case ToolType.EDITOR:
        return <ImageEditor />;
      case ToolType.ZOOMER:
        return <ImageZoomer />;
      case ToolType.ENHANCER:
        return <ImageEnhancer />;
      case ToolType.VISION:
        return <VisionTool />;
      case ToolType.CHAT:
        return <ChatTool />;
      default:
        return <ImageGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      <Sidebar 
        activeTool={activeTool} 
        onSelectTool={setActiveTool} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 transition-all duration-300 md:ml-72 min-h-screen relative flex flex-col">
        {/* Header for Mobile only - spacing purposes primarily */}
        <div className="h-16 md:hidden w-full flex items-center justify-center border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
           <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Nexus AI</span>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;