"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva("w-10 h-10 rounded-full", {
  variants: {
    emotion: {
      happy: "bg-primary/20 text-primary",
      angry: "bg-destructive/20 text-destructive",
    },
  },
  defaultVariants: {
    emotion: "happy",
  },
});

interface ChatAvatarProps extends VariantProps<typeof avatarVariants> {
  className?: string;
}

export function ChatAvatar({ emotion, className }: ChatAvatarProps) {
  return (
    <div className={cn(avatarVariants({ emotion }), className)}>
      {emotion === "happy" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" x2="9.01" y1="9" y2="9" />
          <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" x2="9.01" y1="9" y2="9" />
          <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
      )}
    </div>
  );
}
