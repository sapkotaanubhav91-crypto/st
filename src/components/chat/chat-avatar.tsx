"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva("w-10 h-10 rounded-full flex items-center justify-center", {
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
          width="40"
          height="32"
          viewBox="0 0 40 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              id="paint0_radial_1_2_happy"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(20 16) rotate(90) scale(12 18.5)"
            >
              <stop stopColor="#A8D5FF" />
              <stop offset="1" stopColor="#208CFF" />
            </radialGradient>
            <filter
              id="glow_happy"
              x="-4"
              y="-4"
              width="48"
              height="40"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
            </filter>
          </defs>
          <g filter="url(#glow_happy)">
            <ellipse cx="20" cy="16" rx="15" ry="12" fill="url(#paint0_radial_1_2_happy)" />
          </g>
          <ellipse cx="20" cy="16" rx="15" ry="12" fill="url(#paint0_radial_1_2_happy)" />
          <circle cx="15" cy="16" r="2" fill="white" />
          <circle cx="25" cy="16" r="2" fill="white" />
        </svg>
      ) : (
        <svg
          width="40"
          height="32"
          viewBox="0 0 40 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              id="paint0_radial_1_2_angry"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(20 16) rotate(90) scale(12 18.5)"
            >
              <stop stopColor="#FFC2B2" />
              <stop offset="1" stopColor="#FF5C36" />
            </radialGradient>
             <filter
              id="glow_angry"
              x="-4"
              y="-4"
              width="48"
              height="40"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
            </filter>
          </defs>
          <g filter="url(#glow_angry)">
            <ellipse cx="20" cy="16" rx="15" ry="12" fill="url(#paint0_radial_1_2_angry)" />
          </g>
          <ellipse cx="20" cy="16" rx="15" ry="12" fill="url(#paint0_radial_1_2_angry)" />
          <path d="M13 14 L17 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M17 14 L13 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M23 14 L27 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M27 14 L23 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
