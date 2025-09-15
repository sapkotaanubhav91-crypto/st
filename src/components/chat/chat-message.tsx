"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import type { ChatMessage as ChatMessageProps } from "@/types";
import { useTypewriter } from "@/hooks/use-typewriter";
import { CodeBlock } from "./code-block";
import { ChatAvatar } from "./chat-avatar";
import Image from "next/image";
import React from "react";

function formatContent(text: string) {
  const words = text.split(' ');
  const chunks = [];
  const chunkSize = 60;

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  
  return chunks.map((chunk, index) => (
    <React.Fragment key={index}>
      {chunk}
      {index < chunks.length - 1 && <hr className="my-4 border-white/20" />}
    </React.Fragment>
  ));
}


export function ChatMessage({
  role,
  content,
  image,
  contentType,
  language,
  emotion = "happy",
  isStreaming = false,
}: ChatMessageProps) {
  const typedContent = useTypewriter(
    role === "assistant" && typeof content === "string" && isStreaming ? content : "",
    5
  );

  const displayContent = role === "assistant" && isStreaming && typeof content === "string" ? typedContent : content;
  
  const isUser = role === "user";

  const formattedDisplayContent =
    role === 'assistant' && typeof displayContent === 'string' && contentType !== 'code'
      ? formatContent(displayContent)
      : displayContent;

  return (
    <div
      className={cn(
        "flex items-start gap-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && <ChatAvatar emotion={emotion} className="flex-shrink-0" />}
      <div
        className={cn(
          "max-w-full w-full p-3 rounded-2xl text-sm",
           isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground rounded-bl-none"
        )}
      >
        {image && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
            <Image src={image} alt="User upload" fill className="object-cover" data-ai-hint="user upload" />
          </div>
        )}
        {contentType === "code" && typeof displayContent === "string" ? (
          <CodeBlock code={displayContent} language={language || ""} />
        ) : (
          <div className="whitespace-pre-wrap">{formattedDisplayContent}</div>
        )}
      </div>
      {isUser && (
        <Avatar className="flex-shrink-0 bg-muted">
          <AvatarFallback className="bg-transparent text-foreground">
            <User />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
