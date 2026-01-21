import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from '@/components/ui/sidebar';
import ChatTab from '@/components/chatpage/ChatTab';

import type { Chat } from '@/lib/types';
import { useChats } from '@/lib/state';
import AddChatButton from '@/components/chatpage/AddChatButton';

interface SidebarProps {
    chats: Chat[],
    onAddChat: () => void,
}

export default function AppSidebar({ chats, onAddChat }: SidebarProps) {
    const selectedChatId = useChats((s) => s.selectedChatId);
    const setSelectedChatId = useChats((s) => s.setSelectedChatId); 
    return (
        <Sidebar
            collapsible='offcanvas'
            variant='sidebar'
            style={{ overflowX: 'hidden' }}
        >
            <SidebarHeader className='text-center text-2xl mt-2'>Chats</SidebarHeader>
            <SidebarContent style={{ overflowX: 'hidden' }}>
                <SidebarGroup>
                    {chats.map((chat) => (
                        <ChatTab
                            key={chat.id}
                            title={chat.title}
                            selected={chat.id === selectedChatId}
                            onClick={() => setSelectedChatId(chat.id)}
                        />
                    ))}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <AddChatButton onAdd={onAddChat} />
            </SidebarFooter>
        </Sidebar>
    )
}
