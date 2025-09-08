"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva("w-16 h-16 flex items-center justify-center", {
  variants: {
    emotion: {
      happy: "",
      angry: "",
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
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.0001 3.99999C23.0132 3.99999 22.0673 4.31671 21.3335 4.8889L3.33352 18.8889C1.48003 20.3121 2.79354 23.3333 5.00014 23.3333H12.0001V28.6667C12.0001 30.8754 13.7914 32.6667 16.0001 32.6667H24.0001C24.987 32.6667 25.9329 32.3499 26.6667 31.7777L44.6667 17.7777C46.5202 16.3546 45.2067 13.3333 43.0001 13.3333H36.0001V8.00001C36.0001 5.79131 34.2088 4.00001 32.0001 4.00001L24.0001 3.99999Z"
            fill="url(#paint0_linear_happy)"
          />
          <path
            d="M24.0001 44C24.987 44 25.9329 43.6833 26.6667 43.1111L44.6667 29.1111C46.5202 27.6879 45.2067 24.6667 43.0001 24.6667H36.0001V19.3333C36.0001 17.1246 34.2088 15.3333 32.0001 15.3333H24.0001C23.0132 15.3333 22.0673 15.6501 21.3335 16.2222L3.33352 30.2222C1.48003 31.6454 2.79354 34.6667 5.00014 34.6667H12.0001V40C12.0001 42.2087 13.7914 44 16.0001 44H24.0001Z"
            fill="url(#paint1_linear_happy)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_happy"
              x1="3.33352"
              y1="18.8889"
              x2="41.1558"
              y2="10.8335"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A8D5FF" />
              <stop offset="1" stopColor="#208CFF" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_happy"
              x1="3.33352"
              y1="30.2222"
              x2="41.1558"
              y2="22.1668"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C9A8FF" />
              <stop offset="1" stopColor="#7C20FF" />
            </linearGradient>
          </defs>
        </svg>
      ) : (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.0001 3.99999C23.0132 3.99999 22.0673 4.31671 21.3335 4.8889L3.33352 18.8889C1.48003 20.3121 2.79354 23.3333 5.00014 23.3333H12.0001V28.6667C12.0001 30.8754 13.7914 32.6667 16.0001 32.6667H24.0001C24.987 32.6667 25.9329 32.3499 26.6667 31.7777L44.6667 17.7777C46.5202 16.3546 45.2067 13.3333 43.0001 13.3333H36.0001V8.00001C36.0001 5.79131 34.2088 4.00001 32.0001 4.00001L24.0001 3.99999Z"
            fill="url(#paint0_linear_angry)"
          />
          <path
            d="M24.0001 44C24.987 44 25.9329 43.6833 26.6667 43.1111L44.6667 29.1111C46.5202 27.6879 45.2067 24.6667 43.0001 24.6667H36.0001V19.3333C36.0001 17.1246 34.2088 15.3333 32.0001 15.3333H24.0001C23.0132 15.3333 22.0673 15.6501 21.3335 16.2222L3.33352 30.2222C1.48003 31.6454 2.79354 34.6667 5.00014 34.6667H12.0001V40C12.0001 42.2087 13.7914 44 16.0001 44H24.0001Z"
            fill="url(#paint1_linear_angry)"
          />
          <path
            d="M16 20L20 24"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 20L16 24"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M28 20L32 24"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M32 20L28 24"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
