import { useEffect, useState } from "react";

// Components
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import ProfileManager from "./components/ProfileManager"
import ChatSidebar from "./components/ChatSidebar";
// import ProblemHelpButtonGroup from "./components/ProblemHelpButton";

// Types
import { useAuthSession } from "./hooks/useAuthSession";
import { useChatActions } from "./hooks/useChatActions";

export default function App() {
  useAuthSession(); 
  const { chats, selectedChat, loading, startNewSession, addAttemptMessage, addEmptyChat } = useChatActions();

  return (
    <div className="flex h-screen">
      <ChatSidebar 
        chats={chats} 
        selectedChatId={selectedChat?.id ?? null}
        onAddChat={addEmptyChat}
        onSelectChat={()=>{}}
      />
      {!selectedChat || selectedChat.messages.length === 0 ? (
        <main className="flex flex-col h-full w-full px-[20vw] items-center justify-center">
          <h1 className='mb-2'>Student Assistant</h1>
          <ChatInput onSend={startNewSession} />
        </main>
      ) : (
        <main className="flex flex-col px-[20vw] h-full w-full">
          <ChatWindow messages={selectedChat.messages} loading={loading}/>
          {/* <ProblemHelpButtonGroup onHint={() => handleHelpClick({ mode: "hint"} )} onAnswer={() => handleHelpClick({ mode: "answer" })} onExplanation={() => handleHelpClick({ mode: "explanation" })}/> */}
          <ChatInput onSend={addAttemptMessage} />
        </main>
      )}
      <ProfileManager/>
    </div>
  );
}