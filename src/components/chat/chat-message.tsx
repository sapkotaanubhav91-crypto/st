"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import type { ChatMessage as ChatMessageProps } from "@/types";
import { useTypewriter } from "@/hooks/use-typewriter";
import { CodeBlock } from "./code-block";
import { ChatAvatar } from "./chat-avatar";
import Image from "next/image";

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
          "max-w-[80%] p-3 rounded-2xl text-sm",
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
          <p className="whitespace-pre-wrap">{displayContent}</p>
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
