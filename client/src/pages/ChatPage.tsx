import ChatInput from "@/components/ChatInput";
import ChatWindow from "@/components/ChatWindow";
import ProfileManager from "@/components/ProfileManager"
import Notepad from "@/components/Notepad";
import { useChatActions } from "@/hooks/useChatActions";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

export default function ChatPage() {
  const { chats, selectedChat, loadingAiFeedback, startNewSession, addAttemptMessage, addEmptyChat } = useChatActions();

  return (
    <div className="flex h-screen">
      <SidebarProvider 
        defaultOpen={true}
        style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
      >
        <AppSidebar chats={chats} onAddChat={addEmptyChat}/>
        <SidebarTrigger />

        {!selectedChat || selectedChat.messages.length === 0 ? (
          <main className="flex flex-col h-full w-full px-[10vw] items-center justify-center">
            <h1 className='mb-2'>Student Assistant</h1>
            <ChatInput onSend={startNewSession} />
          </main>
        ) : (
          <main className="flex gap-4 px-[5vw] h-full w-full">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto">
                <ChatWindow messages={selectedChat.messages} loading={loadingAiFeedback}/>
              </div>
              <ChatInput onSend={addAttemptMessage} />
            </div>
            <div className="w-100 flex flex-col min-h-0">
              <Notepad />
            </div>
          </main>
        )}
        <ProfileManager/>
      </SidebarProvider>
    </div>
  );
}