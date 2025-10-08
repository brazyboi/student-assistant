import type { Profile } from '@/types';
import { create } from 'zustand';

export interface UserState {
    activeUser: Profile | null,
    setActiveUser: (profile: Profile | null) => void,
}

export const useActiveUser = create<UserState>((set) => ({
    activeUser: null,
    setActiveUser: (profile: Profile | null) => set({ activeUser: profile }),
}));


export interface ChatIdState {
    chatId: number | null, 
    setChatId: (chatId: number | null) => void,
}

export const useSelectedChatId = create<ChatIdState>((set) => ({
    chatId: null,
    setChatId: (chatId: number | null) => set({ chatId }),
}));