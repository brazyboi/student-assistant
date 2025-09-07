import { useState, useEffect } from "react";

// Components
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import PromptSuggestions from "./components/PromptSuggestions";
import ProfileSelector from "./components/ProfileSelector";
import ChatSidebar from "./components/ChatSidebar";

// Backend
import { sendMessage } from "./api/chat";

// Types
import type { Chat } from "./types";
import type { QueryMode } from "./types";

export default function App() {
  const prompts = [
    "Hint",
    "Reveal Solution",
  ];

  const chats: Chat[] = [
    { 
      id: 1, 
      title: "HIIIII", 
      messages: [ 
        { text: 'Hello', sender: 'user'},  
        { text: 'Hi there! How can I assist you today?', sender: 'ai' }
      ]
    },
    { 
      id: 2, 
      title: "yessir", 
      messages: [
        { text: 'Alternate chat', sender: 'user'},  
        { text: 'This is the other chat.', sender: 'ai' }
      ]
    },
      
  ];

  const [chatsState, setChatsState] = useState<Chat[]>(chats);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(
    chats[0].id
  );

  const currentMessages =
    chatsState.find((chat) => chat.id === selectedChatId)?.messages ?? [];

  async function handleSend(userText: string) {

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

    // Get AI reply
    const reply = await sendMessage(userText, { mode: 'question' }, 1);

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
  }

  async function handleHint(mode: QueryMode, hintIndex: number) {
    const reply = await sendMessage('', mode , hintIndex);
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
  }

  
  // async function handleSend(userText: string) {
  //   setMessages((prev) => [...prev, { sender: "user", text: userText }]);

  //   const reply = await sendMessage(userText);
  //   setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
  // }

  return (
    <div className="flex h-screen">
      <ChatSidebar chats={chats} onSelectChat={setSelectedChatId} selectedChatId={0} />
      <main className="flex flex-col px-48 h-full w-full">
        <ChatWindow messages={currentMessages} />
        <PromptSuggestions prompts={prompts} onSelect={handleHint} />
        <ChatInput onSend={handleSend} />
      </main>
      <ProfileSelector />
    </div>
  );
}