import { useState } from "react";

// Components
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import ProfileManager from "./components/ProfileManager"
import ChatSidebar from "./components/ChatSidebar";
import ProblemHelpButtonGroup from "./components/ProblemHelpButton";

// Backend
// import { sendMessage } from "./api/chat";
import { startSession, addAttempt } from "./api/chat";

// Types
import type { Chat, QueryMode, Profile } from "./types";

export default function App() {
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [chatsState, setChatsState] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const currentMessages = chatsState.find((chat) => chat.id === selectedChatId)?.messages ?? [];

  async function handleStartSession(problem: string) {
    if (!activeProfile) {
      console.error("No active profile — cannot start session");
      return;
    }

    setLoading(true);
    try {
      const topic = "General";
      const result = await startSession(topic, problem);
      if (!result?.id) {
        console.error("Failed to create session", result);
        return;
      }

      const sessionId = result.id;

      // Create a new chat representing this session
      const newChat: Chat = {
        id: sessionId,
        profile_id: activeProfile.id,
        title: (problem.length > 40 ? problem.slice(0, 37) + "..." : problem) || `Session ${sessionId}`,
        messages: [{ sender: "user", text: problem }],
      };

      setChatsState((prev) => [...prev, newChat]);
      setSelectedChatId(sessionId);
    } catch (err) {
      console.error("startSession error:", err);
    } finally {
      setLoading(false);
    }
  };

  async function handleAddAttempt(user_attempt: string) {

    const sessionId = selectedChatId;
    if (!sessionId) {
      console.error("No session selected to add attempt to");
      return;
    }

    // Optimistically add the user's attempt to UI
    setChatsState((prevChats) =>
      prevChats.map((chat) =>
        chat.id === sessionId
          ? { ...chat, messages: [...chat.messages, { sender: "user", text: user_attempt }] }
          : chat
      )
    );

    try {
      setLoading(true);
      const result = await addAttempt(sessionId, user_attempt);
      if (result) {
        const aiFeedback = (result as any).ai_feedback ?? "";
        // Append AI feedback message
        setChatsState((prevChats) =>
          prevChats.map((chat) =>
            chat.id === sessionId
              ? { ...chat, messages: [...chat.messages, { sender: "ai", text: aiFeedback }] }
              : chat
          )
        );
      } else {
        console.error("addAttempt returned no result");
      }
    } catch (err) {
      console.error("addAttempt error:", err);
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
      {!selectedChatId || currentMessages.length === 0 ? (
        <main className="flex flex-col h-full w-full px-[20vw] items-center justify-center">
          <h1 className='mb-2'>Student Assistant</h1>
          <ChatInput onSend={handleStartSession} />
        </main>
      ) : (
        <main className="flex flex-col px-[20vw] h-full w-full">
          <ChatWindow messages={currentMessages} loading={loading}/>
          {/* <ProblemHelpButtonGroup onHint={() => handleHelpClick({ mode: "hint"} )} onAnswer={() => handleHelpClick({ mode: "answer" })} onExplanation={() => handleHelpClick({ mode: "explanation" })}/> */}
          <ChatInput onSend={handleAddAttempt} />
        </main>
      )}
      <ProfileManager activeProfile={activeProfile} setActiveProfile={(profile: any) => setActiveProfile(profile)}/>
    </div>
  );
}