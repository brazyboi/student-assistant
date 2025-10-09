import type { Profile, Chat, Message } from '@/lib/types';
import { create } from 'zustand';

interface UserState {
    activeUser: Profile | null,
    setActiveUser: (profile: Profile | null) => void,
}

interface ChatsState {
    chats: Chat[],
    addChat: (chat: Chat) => void,
    setChats: (chats: Chat[]) => void,

    selectedChatId: number | null, 
    setSelectedChatId: (id: number | null) => void,
    updateChatMessages: (chatId: number | null, messages: Message[]) => void,
    // selectedChatId: number | null, 
    // setSelectedChatId: (chatId: number | null) => void,
}

export const useActiveUser = create<UserState>((set) => ({
    activeUser: null,
    setActiveUser: (profile: Profile | null) => set({ activeUser: profile }),
}));

export const useChats = create<ChatsState>((set) => ({
    chats: new Array<Chat>(),
    addChat: (chat: Chat) => set((state) => ({chats: [chat, ...state.chats]})),
    setChats: (chats: Chat[]) => set({chats}),

    selectedChatId: null,
    setSelectedChatId: (id: number | null) => set(({ selectedChatId: id })),
    updateChatMessages: (chatId: number | null, messages: Message[]) => 
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

    // selectedChatId: null,
    // setSelectedChatId: (chatId: number | null) => set({ selectedChatId: chatId }),
}));