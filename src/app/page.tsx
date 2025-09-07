import { ChatLayout } from "@/components/chat/chat-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center w-full bg-black">
      <ChatLayout />
      <footer className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center">
        <Avatar className="w-6 h-6">
          <AvatarFallback className="bg-muted text-white text-xs">N</AvatarFallback>
        </Avatar>
        <div />
      </footer>
    </main>
  );
}
