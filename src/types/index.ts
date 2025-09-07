import type React from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
  image?: string;
  contentType?: 'text' | 'code';
  language?: string;
  emotion?: 'happy' | 'angry';
  isStreaming?: boolean;
}
