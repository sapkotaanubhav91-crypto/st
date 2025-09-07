"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getAntharaResponse } from "@/lib/actions";
import { ChatList } from "./chat-list";
import { ChatInput } from "./chat-input";
import type { ChatMessage } from "@/types";

export function ChatLayout() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<"happy" | "angry">("happy");

  useEffect(() => {
    // Initial greeting from Anthara
    const initialMessage: ChatMessage = {
      id: uuidv4(),
      role: "assistant",
      content: "What can I help you with?",
      emotion: "happy",
      isStreaming: true,
    };
    setMessages([initialMessage]);
  }, []);

  const handleSend = async (message: string, imageDataUri: string | null) => {
    if (isLoading) return;
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: message,
      image: imageDataUri ?? undefined,
    };
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : (msg.content.props as any).code || ''
      }));

      const result = await getAntharaResponse(history, message, imageDataUri);

      setCurrentEmotion(result.isAppropriate ? "happy" : "angry");

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: result.response,
        contentType: result.contentType,
        language: result.language,
        emotion: result.isAppropriate ? "happy" : "angry",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response from AI:", error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        emotion: "angry",
        isStreaming: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
