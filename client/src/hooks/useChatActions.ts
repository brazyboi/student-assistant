import { startSession, addAttempt, streamAttemptFeedback, getHint } from '@/api/chat';
import type { Chat, HintLevel } from '@/lib/types';
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
  const { chats, addChat, setChats, updateChatMessages, selectedChatId, setSelectedChatId, loadingAiFeedback, setLoadingAiFeedback, appendToLastMessage, updateTutorState } = useChats();

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
      tutorState: {
        currentHintLevel: "none",
        userHasAttempted: false,
        studentInput: ""
      }
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
        tutorState: {
          currentHintLevel: "none",
          userHasAttempted: false,
          studentInput: ""
        }
      };

      setChats([
        newChat,
        ...chats.filter((c) => c.id !== tempId),
      ]);
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

  async function addAttemptMessage(text: string) {
    if (!selectedChat) return;
    if (loadingAiFeedback) return;
    
    // Store the student's attempt in tutor state
    updateTutorState(selectedChat.id, "none", true, text);
    
    updateChatMessages(selectedChat.id, [{ sender: "user", text }]);
    setLoadingAiFeedback(true);
    
    try {
      await streamAttemptFeedback(selectedChat.id, text, (chunk) => {
        appendToLastMessage(selectedChat.id, chunk);
      });
    } finally {
      setLoadingAiFeedback(false);
    }
  }

  async function requestHint() {
    if (!selectedChat || !selectedChat.tutorState) return;
    if (loadingAiFeedback) return;

    setLoadingAiFeedback(true);
    try {
      const result = await getHint(
        selectedChat.id,
        selectedChat.tutorState.studentInput,
        selectedChat.tutorState.currentHintLevel
      );

      // Update tutor state with new hint level
      updateTutorState(selectedChat.id, result.hint_level, true, selectedChat.tutorState.studentInput);

      // Add hint to chat as AI message
      updateChatMessages(selectedChat.id, [{ sender: "ai", text: result.hint }]);
    } catch (err) {
      console.error('Error getting hint', err);
    } finally {
      setLoadingAiFeedback(false);
    }
  }

  async function requestSolution() {
    if (!selectedChat || !selectedChat.tutorState) return;
    if (loadingAiFeedback) return;

    setLoadingAiFeedback(true);
    try {
      const result = await getHint(
        selectedChat.id,
        selectedChat.tutorState.studentInput,
        "partial"
      );

      // Update tutor state to solution unlocked
      updateTutorState(selectedChat.id, "solution", true, selectedChat.tutorState.studentInput);

      // Add solution to chat as AI message
      updateChatMessages(selectedChat.id, [{ sender: "ai", text: result.hint }]);
    } catch (err) {
      console.error('Error requesting solution', err);
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
    requestHint,
    requestSolution,
    addEmptyChat 
  };
}