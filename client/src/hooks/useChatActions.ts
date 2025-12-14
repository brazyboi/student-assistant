import { startSession, addAttempt, streamAttemptFeedback } from '@/api/chat';
import type { Chat } from '@/lib/types';
import { useChats, useActiveUser } from '@/lib/state';

function generateUUID() {
  if (typeof self !== 'undefined' && self.crypto && self.crypto.randomUUID) {
    return self.crypto.randomUUID();
  }
  
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

export function useChatActions() {
  const activeUser = useActiveUser((s) => s.activeUser);
  const { chats, addChat, setChats, updateChatMessages, selectedChatId, setSelectedChatId, loadingAiFeedback, setLoadingAiFeedback, appendToLastMessage } = useChats();

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  async function startNewSession(problem: string) {
    if (!activeUser) return;
    if (loadingAiFeedback) return;
    
    const problemTitle = problem.length > 40 ? problem.slice(0, 37) + "..." : problem

    const tempId = generateUUID();
    const tempSession: Chat = {
      id: tempId,
      title: problemTitle,
      profile_id: activeUser.id,
      messages: [{sender: 'user', text: problem}],
    };
    addChat(tempSession);
    setSelectedChatId(tempId);

    try {
      const topic = "General";
      const result = await startSession(topic, problem);
      if (!result?.id) throw new Error("Failed to create session");
      
      const newChat: Chat = {
        id: result.id,
        profile_id: activeUser.id,
        title: problemTitle || `Session ${result.id}`,
        messages: [{ sender: "user", text: problem }],
      };

      setChats([
        newChat,
        ...chats.filter((c) => c.id !== tempId),
      ]);
      // addChat(newChat);
      setSelectedChatId(newChat.id);
    } catch (err) {
      console.error('Error adding session', err);
      setChats([
        ...chats.filter((c) => c.id !== tempId),
      ]);
    } finally {
      setLoadingAiFeedback(false);
    }
  }

  // async function addAttemptMessage(text: string) {
  //   if (!selectedChat) return;
  //   if (loadingAiFeedback) return;
  //   updateChatMessages(selectedChat.id, [{ sender: "user", text }]);

  //   setLoadingAiFeedback(true);
  //   try {
  //     const result = await addAttempt(selectedChat.id, text);
  //     const aiFeedback = (result as any)?.ai_feedback ?? "";
  //     updateChatMessages(selectedChat.id, [{ sender: "ai", text: aiFeedback }]);
  //   } finally {
  //     setLoadingAiFeedback(false);
  //   }
  // }
  async function addAttemptMessage(text: string) {
    if (!selectedChat) return;
    if (loadingAiFeedback) return;
    updateChatMessages(selectedChat.id, [{ sender: "user", text }]);
    setLoadingAiFeedback(true);
    
    try {
      const result = await streamAttemptFeedback(selectedChat.id, text, (chunk) => {
        appendToLastMessage(selectedChat.id, chunk);
      });
      let aiFeedback = "";

    } finally {
      setLoadingAiFeedback(false);
    }
  }

  function addEmptyChat() {
    if (!activeUser) return;
    setSelectedChatId(null);
  }

  return { 
    chats, 
    selectedChat, 
    loadingAiFeedback, 
    startNewSession, 
    addAttemptMessage, 
    addEmptyChat 
  };
}