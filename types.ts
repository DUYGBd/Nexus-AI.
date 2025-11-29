
export enum ToolType {
  GENERATOR = 'GENERATOR',
  EDITOR = 'EDITOR',
  VISION = 'VISION',
  CHAT = 'CHAT',
  ZOOMER = 'ZOOMER',
  ENHANCER = 'ENHANCER',
  SKETCH = 'SKETCH'
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