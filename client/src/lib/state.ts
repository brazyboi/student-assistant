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

    selectedChat: Chat | null, 
    setSelectedChat: (chat: Chat | null) => void,
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

    selectedChat: null,
    setSelectedChat: (chat: Chat | null) => set(({ selectedChat: chat })),
    updateChatMessages: (chatId: number | null, messages: Message[]) => 
        set((state) => ({
            chats: state.chats.map((c) =>
                c.id === chatId ? {...c, messages} : c
            )
        })),

    // selectedChatId: null,
    // setSelectedChatId: (chatId: number | null) => set({ selectedChatId: chatId }),
}));