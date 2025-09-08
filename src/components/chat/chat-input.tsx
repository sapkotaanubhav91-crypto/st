"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Paperclip, Mic, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChatInputProps {
  onSend: (message: string, imageDataUri: string | null) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<{ file: File; preview: string } | null>(
    null
  );
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setMessage(
          (prevMessage) => prevMessage + finalTranscript + interimTranscript
        );
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !image) return;
    onSend(message, image?.preview ?? null);
    setMessage("");
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 bg-background w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {image && (
          <div className="relative w-24 h-24 mb-2">
            <Image
              src={image.preview}
              alt="Image preview"
              fill
              className="object-cover rounded-lg"
              data-ai-hint="image preview"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 w-6 h-6 bg-background/50 backdrop-blur-sm rounded-full"
              onClick={() => {
                setImage(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        <div className="relative flex items-center">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            placeholder="Type a Message"
            className="w-full bg-muted text-foreground placeholder:text-muted-foreground rounded-full pl-10 pr-16 py-2 resize-none h-10 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute left-3 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-foreground/60 hover:text-foreground h-6 w-6"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute right-1 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleMicClick}
              disabled={isLoading}
              className={cn("text-foreground/60 hover:text-foreground h-8 w-8", isListening && "text-blue-400")}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || (!message.trim() && !image)}
              className="bg-primary hover:bg-primary/80 text-primary-foreground rounded-full h-8 w-8"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.00014 1.33333C7.67115 1.33333 7.35593 1.4389 7.11131 1.62963L1.11131 6.2963C0.493348 6.77071 0.931195 7.77777 1.66681 7.77777H4.00014V9.55555C4.00014 10.2917 4.59196 10.8889 5.33348 10.8889H8.00014C8.32913 10.8889 8.64435 10.7833 8.88897 10.5926L14.889 5.92592C15.5069 5.45152 15.0691 4.44444 14.3335 4.44444H12.0001V2.66666C12.0001 1.93045 11.4083 1.33333 10.6668 1.33333L8.00014 1.33333Z" fill="url(#paint0_linear_send)"/>
                <path d="M8.00014 14.6667C8.32913 14.6667 8.64435 14.5611 8.88897 14.3704L14.889 9.7037C15.5069 9.22929 15.0691 8.22222 14.3335 8.22222H12.0001V6.44444C12.0001 5.70823 11.4083 5.11111 10.6668 5.11111H8.00014C7.67115 5.11111 7.35593 5.21668 7.11131 5.4074L1.11131 10.0741C0.493348 10.5485 0.931195 11.5556 1.66681 11.5556H4.00014V13.3333C4.00014 14.0695 4.59196 14.6667 5.33348 14.6667H8.00014Z" fill="url(#paint1_linear_send)"/>
                <defs>
                  <linearGradient id="paint0_linear_send" x1="1.11131" y1="6.2963" x2="13.7187" y2="3.61116" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A8D5FF"/>
                    <stop offset="1" stopColor="#208CFF"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_send" x1="1.11131" y1="10.0741" x2="13.7187" y2="7.38894" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#C9A8FF"/>
                    <stop offset="1" stopColor="#7C20FF"/>
                  </linearGradient>
                </defs>
              </svg>
            </Button>
          </div>
        </div>
      </form>
       <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
    </div>
  );
}
