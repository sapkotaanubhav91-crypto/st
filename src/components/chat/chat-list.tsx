"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage as ChatMessageComponent } from "./chat-message";
import type { ChatMessage } from "@/types";
import { Loader2 } from "lucide-react";

interface ChatListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatList({ messages, isLoading }: ChatListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
        {messages.map((message, index) => (
          <ChatMessageComponent key={message.id} {...message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0"></div>
            <div className="flex items-center justify-center pt-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
