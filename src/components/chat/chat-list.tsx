"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage as ChatMessageComponent } from "./chat-message";
import type { ChatMessage } from "@/types";
import { ChatAvatar } from "./chat-avatar";

interface ChatListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatList({ messages, isLoading }: ChatListProps) {
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
      <div className="p-4 md:p-6 space-y-6">
        {messages.map((message) => (
          <ChatMessageComponent key={message.id} {...message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <ChatAvatar emotion="happy" className="flex-shrink-0" />
            <div className="flex items-center space-x-2 pt-2">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
