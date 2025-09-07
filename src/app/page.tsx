import { Header } from "@/components/header";
import { ChatLayout } from "@/components/chat/chat-layout";

export default function Home() {
  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center w-full">
      <div className="flex flex-col w-full h-full max-w-4xl border-x">
        <Header />
        <ChatLayout />
      </div>
    </main>
  );
}
