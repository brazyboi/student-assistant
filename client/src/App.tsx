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
      title: "Current Chat", 
      messages: [ 
      ]
    },
  ];

  const [chatsState, setChatsState] = useState<Chat[]>(chats);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(
    chats[0].id
  );

  const currentMessages =
    chatsState.find((chat) => chat.id === selectedChatId)?.messages ?? [];

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
      const reply = await sendMessage(selectedChat, userText, 'question');

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

  // async function handleHint(mode: QueryMode, hintIndex: number) {
  //   const reply = await sendMessage('', mode , hintIndex);
  //   setChatsState((prevChats) =>
  //     prevChats.map((chat) =>
  //       chat.id === selectedChatId
  //         ? {
  //             ...chat,
  //             messages: [...chat.messages, { sender: "ai", text: reply }],
  //           }
  //         : chat
  //     )
  //   );
  // }

  return (
    <div className="flex h-screen">
      <ChatSidebar chats={chats} onSelectChat={setSelectedChatId} selectedChatId={0} />
      {currentMessages.length === 0 ? (
        <main className="flex flex-col h-full w-full px-32 items-center justify-center">
          <h1>Student Assistant</h1>
          <ChatInput onSend={handleSend} />
        </main>
      ) : (
        <main className="flex flex-col px-32 h-full w-full">
          <ChatWindow messages={currentMessages} loading={loading}/>
          {/* <PromptSuggestions prompts={prompts} onSelect={handleHint} /> */}
          <ChatInput onSend={handleSend} />
        </main>
      )}
      <ProfileSelector />
    </div>
  );
}