import { useEffect, useState } from "react";

// Components
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import ProfileManager from "./components/ProfileManager"
import ChatSidebar from "./components/ChatSidebar";
import ProblemHelpButtonGroup from "./components/ProblemHelpButton";

// State
import { useActiveUser, useSelectedChatId } from './lib/state';

// Backend
// import { sendMessage } from "./api/chat";
import { startSession, addAttempt } from "@/api/chat";
import { supabase } from "@/api/supabaseClient";

// Types
import type { Chat, QueryMode, Profile } from "./types";

export default function App() {
  const activeProfile = useActiveUser((s) => s.activeUser);
  const setActiveUser = useActiveUser((s) => s.setActiveUser);

  const selectedChatId = useSelectedChatId((s) => s.chatId);
  const setSelectedChatId = useSelectedChatId((s) => s.setChatId);

  const [chatsState, setChatsState] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  const currentMessages = chatsState.find((chat) => chat.id === selectedChatId)?.messages ?? [];

  useEffect(() => {
    const getLoginSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session?.user) {
        setActiveUser({ id: data.session.user.id, email: data.session.user.email } as Profile);
      }
    }

    getLoginSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setActiveUser({ id: session.user.id, email: session.user.email } as Profile);
      } else {
        setActiveUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setActiveUser]);

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
    if (!activeProfile) return;

    const newId =
      chatsState.length > 0 ? Math.max(...chatsState.map((c) => c.id)) + 1 : 1;

    const newChat: Chat = {
      id: newId,
      profile_id: activeProfile.id,
      title: `Chat ${newId}`,
      messages: [],
    };

    setChatsState((prevChats) => [...prevChats, newChat]);
    setSelectedChatId(newId);
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar 
        chats={chatsState} 
        selectedChatId={selectedChatId}
        onAddChat={handleAddChat}
        onSelectChat={()=>{}}
      />
      {!selectedChatId || currentMessages.length === 0 ? (
        <main className="flex flex-col h-full w-full px-[20vw] items-center justify-center">
          {/* <h1 className='mb-2'>Student Assistant</h1> */}
          <ChatInput onSend={handleStartSession} />
        </main>
      ) : (
        <main className="flex flex-col px-[20vw] h-full w-full">
          <ChatWindow messages={currentMessages} loading={loading}/>
          {/* <ProblemHelpButtonGroup onHint={() => handleHelpClick({ mode: "hint"} )} onAnswer={() => handleHelpClick({ mode: "answer" })} onExplanation={() => handleHelpClick({ mode: "explanation" })}/> */}
          <ChatInput onSend={handleAddAttempt} />
        </main>
      )}
      <ProfileManager/>
    </div>
  );
}