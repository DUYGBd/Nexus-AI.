
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import VisionTool from './components/VisionTool';
import ChatTool from './components/ChatTool';
import ImageZoomer from './components/ImageZoomer';
import ImageEnhancer from './components/ImageEnhancer';
import LiveSketch from './components/LiveSketch';
import BackgroundChanger from './components/BackgroundChanger';
import CodeExpert from './components/CodeExpert';
import Translator from './components/Translator';
import Summarizer from './components/Summarizer';
import StoryWriter from './components/StoryWriter';
import SocialAssistant from './components/SocialAssistant';
import AiChef from './components/AiChef';
import MemeMaker from './components/MemeMaker';
import DreamWeaver from './components/DreamWeaver';
import StudyBuddy from './components/StudyBuddy';

// New Components
import IconGenerator from './components/IconGenerator';
import LogoCreator from './components/LogoCreator';
import TattooDesigner from './components/TattooDesigner';
import PatternMaker from './components/PatternMaker';
import StickerMaker from './components/StickerMaker';
import PaletteGenerator from './components/PaletteGenerator';
import PromptPerfect from './components/PromptPerfect';
import InterviewCoach from './components/InterviewCoach';
import Nutritionist from './components/Nutritionist';
import LegalEase from './components/LegalEase';
import TravelGuide from './components/TravelGuide';
import FitnessPlanner from './components/FitnessPlanner';
import InteriorDesign from './components/InteriorDesign';
import FashionStylist from './components/FashionStylist';
import SpeechWriter from './components/SpeechWriter';

import { ToolType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.GENERATOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTool) {
      case ToolType.GENERATOR: return <ImageGenerator />;
      case ToolType.SKETCH: return <LiveSketch />;
      case ToolType.EDITOR: return <ImageEditor />;
      case ToolType.BACKGROUND: return <BackgroundChanger />;
      case ToolType.ZOOMER: return <ImageZoomer />;
      case ToolType.ENHANCER: return <ImageEnhancer />;
      case ToolType.VISION: return <VisionTool />;
      case ToolType.CODE: return <CodeExpert />;
      case ToolType.TRANSLATOR: return <Translator />;
      case ToolType.SUMMARIZER: return <Summarizer />;
      case ToolType.WRITER: return <StoryWriter />;
      case ToolType.SOCIAL: return <SocialAssistant />;
      case ToolType.CHEF: return <AiChef />;
      case ToolType.MEME: return <MemeMaker />;
      case ToolType.DREAM: return <DreamWeaver />;
      case ToolType.STUDY: return <StudyBuddy />;
      case ToolType.CHAT: return <ChatTool />;
      
      // New Routes
      case ToolType.ICON: return <IconGenerator />;
      case ToolType.LOGO: return <LogoCreator />;
      case ToolType.TATTOO: return <TattooDesigner />;
      case ToolType.PATTERN: return <PatternMaker />;
      case ToolType.STICKER: return <StickerMaker />;
      case ToolType.PALETTE: return <PaletteGenerator />;
      case ToolType.PROMPT: return <PromptPerfect />;
      case ToolType.INTERVIEW: return <InterviewCoach />;
      case ToolType.NUTRITION: return <Nutritionist />;
      case ToolType.LEGAL: return <LegalEase />;
      case ToolType.TRAVEL: return <TravelGuide />;
      case ToolType.FITNESS: return <FitnessPlanner />;
      case ToolType.INTERIOR: return <InteriorDesign />;
      case ToolType.FASHION: return <FashionStylist />;
      case ToolType.SPEECH: return <SpeechWriter />;
      
      default: return <ImageGenerator />;
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
        {/* Header for Mobile only */}
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
