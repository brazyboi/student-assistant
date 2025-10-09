import { useEffect, useState } from "react";

// Components
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import ProfileManager from "./components/ProfileManager"
import ChatSidebar from "./components/ChatSidebar";
import ProblemHelpButtonGroup from "./components/ProblemHelpButton";

// State
import { useActiveUser, useChats } from './lib/state';

// Backend
// import { sendMessage } from "./api/chat";
import { startSession, addAttempt } from "@/api/chat";
import { supabase } from "@/api/supabaseClient";

// Types
import type { Chat, QueryMode, Profile, Message } from "./lib/types";

export default function App() {
  const activeUser = useActiveUser((s) => s.activeUser);
  const setActiveUser = useActiveUser((s) => s.setActiveUser);
  const currentChats = useChats((s) => s.chats);
  const addChat = useChats((s) => s.addChat);
  const setChats = useChats((s) => s.setChats);
  const updateChatMessages = useChats((s) => s.updateChatMessages);
  const selectedChatId = useChats((s) => s.selectedChatId);
  const setSelectedChatId = useChats((s) => s.setSelectedChatId);

  const selectedChat = currentChats.find(c => c.id === selectedChatId);
  const [loading, setLoading] = useState(false);

  // const currentMessages = chatsState.find((chat) => chat.id === selectedChatId)?.messages ?? [];

  // CHECK FOR LOGIN
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
    if (!activeUser) {
      console.error("No active profile... cannot start session");
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
        profile_id: activeUser.id,
        title: (problem.length > 40 ? problem.slice(0, 37) + "..." : problem) || `Session ${sessionId}`,
        messages: [{ sender: "user", text: problem }],
      };

      addChat(newChat);
      setSelectedChatId(newChat.id);
    } catch (err) {
      console.error("startSession error:", err);
    } finally {
      setLoading(false);
    }
  };

  function addMessageToSelectedChat(message: Message) {
    if (!selectedChat) return;
    updateChatMessages(selectedChatId, [message]);
    console.log(selectedChat.messages);
  }

  async function handleAddAttempt(user_attempt: string) {
    if (!selectedChat) return;

    addMessageToSelectedChat({ sender: "user", text: user_attempt } as Message);
    console.log('my selected chat: ', selectedChat);

    try {
      if (!selectedChat) return;
      setLoading(true);

      const result = await addAttempt(selectedChat.id, user_attempt);
      if (result) {
        const aiFeedback = (result as any).ai_feedback ?? "";
        addMessageToSelectedChat({ sender: "ai", text: aiFeedback});
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
    if (!activeUser) return;
    if (!selectedChat?.messages) return; 

    const newId =
      currentChats.length > 0 ? Math.max(...currentChats.map((c) => c.id)) + 1 : 1;

    const newChat: Chat = {
      id: newId,
      profile_id: activeUser.id,
      title: `Chat ${newId}`,
      messages: [],
    };

    addChat(newChat);
    setSelectedChatId(newChat.id);
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar 
        chats={currentChats} 
        selectedChatId={selectedChat?.id ?? null}
        onAddChat={handleAddChat}
        onSelectChat={()=>{}}
      />
      {!selectedChat || selectedChat.messages.length === 0 ? (
        <main className="flex flex-col h-full w-full px-[20vw] items-center justify-center">
          <h1 className='mb-2'>Student Assistant</h1>
          <ChatInput onSend={handleStartSession} />
        </main>
      ) : (
        <main className="flex flex-col px-[20vw] h-full w-full">
          <ChatWindow messages={selectedChat.messages} loading={loading}/>
          {/* <ProblemHelpButtonGroup onHint={() => handleHelpClick({ mode: "hint"} )} onAnswer={() => handleHelpClick({ mode: "answer" })} onExplanation={() => handleHelpClick({ mode: "explanation" })}/> */}
          <ChatInput onSend={handleAddAttempt} />
        </main>
      )}
      <ProfileManager/>
    </div>
  );
}