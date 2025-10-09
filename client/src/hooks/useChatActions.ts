import { startSession, addAttempt } from '@/api/chat';
import type { Chat } from '@/lib/types';
import { useState } from 'react';
import { useChats, useActiveUser } from '@/lib/state';

export function useChatActions() {
  const activeUser = useActiveUser((s) => s.activeUser);
  const { chats, addChat, setChats, updateChatMessages, selectedChatId, setSelectedChatId } = useChats();
  const [loading, setLoading] = useState(false);

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  async function startNewSession(problem: string) {
    if (!activeUser) return;
    
    const problemTitle = problem.length > 40 ? problem.slice(0, 37) + "..." : problem

    const tempId = Date.now();
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
        ...chats.filter((c) => c.id !== tempId),
        newChat,
      ]);
      // addChat(newChat);
      setSelectedChatId(newChat.id);
    } catch (err) {
      console.error('Error adding session');
      setChats([
        ...chats.filter((c) => c.id !== tempId),
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function addAttemptMessage(text: string) {
    if (!selectedChat) return;
    updateChatMessages(selectedChat.id, [{ sender: "user", text }]);

    setLoading(true);
    try {
      const result = await addAttempt(selectedChat.id, text);
      const aiFeedback = (result as any)?.ai_feedback ?? "";
      updateChatMessages(selectedChat.id, [{ sender: "ai", text: aiFeedback }]);
    } finally {
      setLoading(false);
    }
  }

  function addEmptyChat() {
    if (!activeUser) return;
    setSelectedChatId(null);
  }

  return { 
    chats, 
    selectedChat, 
    loading, 
    startNewSession, 
    addAttemptMessage, 
    addEmptyChat 
  };
}