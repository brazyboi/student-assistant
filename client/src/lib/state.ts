import type { Profile, Chat, Message } from '@/lib/types';
import { create } from 'zustand';

const MESSAGE_COOLDOWN_MS = 1500;

interface UserState {
    activeUser: Profile | null,
    isLoading: boolean;
    setActiveUser: (profile: Profile | null) => void,
    setIsLoading: (loading: boolean) => void
}

interface ChatsState {
    chats: Chat[],
    addChat: (chat: Chat) => void,
    setChats: (chats: Chat[]) => void,

    selectedChatId: number | string | null, 
    setSelectedChatId: (id: number | string | null) => void,
    updateChatMessages: (chatId: number | string | null, messages: Message[]) => void,
    appendToLastMessage: (chatId: number | string | null, chunk: string) => void,

    loadingAiFeedback: boolean,
    setLoadingAiFeedback: (loading: boolean) => void,
    
    lastMessageTimestamp: number,
    canSendMessage: boolean,
    setMessageSent: () => void,
}

export const useActiveUser = create<UserState>((set) => ({
    activeUser: null,
    isLoading: true,
    setActiveUser: (profile: Profile | null) => set({ activeUser: profile }),
    setIsLoading: (loading: boolean) => set({isLoading: loading})
}));

export const useChats = create<ChatsState>((set) => ({
    chats: new Array<Chat>(),
    addChat: (chat: Chat) => set((state) => ({chats: [chat, ...state.chats]})),
    setChats: (chats: Chat[]) => set({chats}),

    selectedChatId: null,
    setSelectedChatId: (id: number | string | null) => set(({ selectedChatId: id })),
    updateChatMessages: (chatId: number | string | null, messages: Message[]) => 
        set((state) => {
            if (chatId == null) return state;
            return {
                chats: state.chats.map((c) =>
                    c.id === chatId ? 
                        {...c, messages: [...c.messages, ...messages]} 
                        : c
                )
            }
        }),
    
    appendToLastMessage: (chatId: number | string | null, chunk: string) =>
        set((state) => {
            if (chatId == null) return state;
            const chat = state.chats.find(c => c.id === chatId);
            if (!chat) return state;

            const messages = [...chat.messages];
            const lastMsg = messages[messages.length - 1];
            
            if (lastMsg?.sender === 'ai') {
                messages[messages.length - 1] = {
                    ...lastMsg,
                    text: lastMsg.text + chunk
                };
            } else {
                messages.push({
                    sender: 'ai',
                    text: chunk
                });
            }

            return {
                chats: state.chats.map(c =>
                    c.id === chatId ? {...c, messages} : c
                )
            };
        }),

    loadingAiFeedback: false,
    setLoadingAiFeedback: (loading) => {
        set({ loadingAiFeedback: loading });

        // When AI finishes loading, start cooldown timer
        if (!loading) {
            const cooldown = 2000; // 2 seconds
            const now = Date.now();
            set({ lastMessageTimestamp: now });

            setTimeout(() => {
                // Reset canSendMessage after cooldown
                set({ lastMessageTimestamp: 0 });
            }, cooldown);
        }
    },

    lastMessageTimestamp: 0,
    canSendMessage: true,
    setMessageSent: () => {
        const now = Date.now();
        set({ lastMessageTimestamp: now });
        // canSendMessage becomes false immediately, automatically reset in 2s
        set({ canSendMessage: false });
        setTimeout(() => set({ canSendMessage: true }), MESSAGE_COOLDOWN_MS);
    },

    // selectedChatId: null,
    // setSelectedChatId: (chatId: number | null) => set({ selectedChatId: chatId }),
}));