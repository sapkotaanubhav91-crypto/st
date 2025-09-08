"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Paperclip, Mic, ArrowUp, X } from "lucide-react";
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
    <div className="p-4 bg-black w-full max-w-4xl mx-auto">
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
            className="w-full bg-muted text-white placeholder:text-white/60 rounded-full pl-12 pr-20 py-2 resize-none h-10 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute left-4 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white h-6 w-6"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute right-2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleMicClick}
              disabled={isLoading}
              className={cn("text-white/60 hover:text-white h-6 w-6", isListening && "text-blue-400")}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || (!message.trim() && !image)}
              className="bg-primary hover:bg-primary/80 text-white rounded-full h-6 w-6"
            >
              <ArrowUp className="w-4 h-4" />
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
