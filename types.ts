
export enum ToolType {
  GENERATOR = 'GENERATOR',
  EDITOR = 'EDITOR',
  VISION = 'VISION',
  CHAT = 'CHAT',
  ZOOMER = 'ZOOMER',
  ENHANCER = 'ENHANCER',
  SKETCH = 'SKETCH',
  BACKGROUND = 'BACKGROUND',
  CODE = 'CODE',
  TRANSLATOR = 'TRANSLATOR',
  SUMMARIZER = 'SUMMARIZER',
  WRITER = 'WRITER',
  SOCIAL = 'SOCIAL',
  CHEF = 'CHEF',
  MEME = 'MEME',
  DREAM = 'DREAM',
  STUDY = 'STUDY',
  // New Tools
  ICON = 'ICON',
  LOGO = 'LOGO',
  TATTOO = 'TATTOO',
  PATTERN = 'PATTERN',
  STICKER = 'STICKER',
  PALETTE = 'PALETTE',
  PROMPT = 'PROMPT',
  INTERVIEW = 'INTERVIEW',
  NUTRITION = 'NUTRITION',
  LEGAL = 'LEGAL',
  TRAVEL = 'TRAVEL',
  FITNESS = 'FITNESS',
  INTERIOR = 'INTERIOR',
  FASHION = 'FASHION',
  SPEECH = 'SPEECH'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
  isError?: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface ToolConfig {
  id: ToolType;
  name: string;
  description: string;
  icon: string;
}
