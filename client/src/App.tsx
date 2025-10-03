import { useState } from "react";

// Components
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import ProfileManager from "./components/ProfileManager"
import ChatSidebar from "./components/ChatSidebar";
import ProblemHelpButtonGroup from "./components/ProblemHelpButton";

// Backend
import { sendMessage } from "./api/chat";

// Types
import type { Chat, QueryMode, Profile } from "./types";

export default function App() {
  const chats: Chat[] = [
    { 
      id: 5050,
      profile_id: 1, 
      title: "Current Chat", 
      messages: [ 
      ]
    },
  ];
  // const testProfile = { id: 1, email: 'hi@gmail.com'} as Profile;

  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [chatsState, setChatsState] = useState<Chat[]>(chats);
  const [selectedChatId, setSelectedChatId] = useState<number | null>( chats[0].id );

  const currentMessages = chatsState.find((chat) => chat.id === selectedChatId)?.messages ?? [];

  const [loading, setLoading] = useState(false);

  async function handleSend(userText: string) {
    const selectedChat = chatsState.find((c) => c.id === selectedChatId);
    if (!selectedChat) return;

    // Optimistically add user message
    setChatsState((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, { sender: "user", text: userText }],
            }
          : chat
      )
    );

    setLoading(true);

    try {
      // Get AI reply
      const reply = await sendMessage(selectedChat, userText, { mode: 'question' });

      setChatsState((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, { sender: "ai", text: reply }],
              }
            : chat
        )
      );


    } finally {
      setLoading(false);
    }
  }

  async function handleHelpClick(helpType: QueryMode) {
    const selectedChat = chatsState.find((c) => c.id === selectedChatId);
    if (!selectedChat) return;

    setLoading(true);

    try {
      // Get AI reply
      const reply = await sendMessage(selectedChat, '', helpType);

      setChatsState((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, { sender: "ai", text: reply }],
              }
            : chat
        )
      );


    } finally {
      setLoading(false);
    }
  }
  
  function handleAddChat() {
    console.log("Adding chat")
    setChatsState((prevChats) => {
      const newId = prevChats.length > 0 ? Math.max(...prevChats.map(c => c.id)) + 1 : 1;
      if (!activeProfile) return prevChats;
      const newChat : Chat = { id: newId, profile_id: activeProfile.id, title: `Chat ${newId}`, messages: [] };
      setSelectedChatId(newId);
      return [...prevChats, newChat];
    });
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar 
        chats={chatsState} 
        onSelectChat={setSelectedChatId} 
        selectedChatId={selectedChatId}
        onAddChat={handleAddChat}
      />
      {currentMessages.length === 0 ? (
        <main className="flex flex-col h-full w-full px-[10vw] items-center justify-center">
          {/* <h1>Student Assistant</h1> */}
          <ChatInput onSend={handleSend} />
        </main>
      ) : (
        <main className="flex flex-col px-[10vw] h-full w-full">
          <ChatWindow messages={currentMessages} loading={loading}/>
          <ProblemHelpButtonGroup onHint={() => handleHelpClick({ mode: "hint"} )} onAnswer={() => handleHelpClick({ mode: "answer" })} onExplanation={() => handleHelpClick({ mode: "explanation" })}/>
          <ChatInput onSend={handleSend} />
        </main>
      )}
      <ProfileManager activeProfile={activeProfile} setActiveProfile={(profile: any) => setActiveProfile(profile)}/>
    </div>
  );
}