import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react';
import { useChats } from '@/lib/state';

export default function ChatInput({ onSend }: { onSend: (message: string) => void }) {
    const [message, setMessage] = React.useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const loadingAiFeedback = useChats((state) => state.loadingAiFeedback);
    const canSendMessage = useChats((state) => state.canSendMessage);
    const setMessageSent = useChats((state) => state.setMessageSent);

    const handleInput = () => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        el.style.height = `${el.scrollHeight}px`
    }

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (loadingAiFeedback || !canSendMessage) return;
        if (e) e.preventDefault();
        if (loadingAiFeedback) return;
        const text = message.trim();
        if (!text) return;
        onSend(text);

        setMessageSent();
        setMessage('');
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="relative mb-4 justify-center w-full"
        >
            <Textarea
                ref={textareaRef}
                rows={1}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                placeholder='Enter problem...'
                className="resize-none overflow-hidden break-words whitespace-pre-wrap break-all pr-12 border-2 border-secondary"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                autoComplete='off'
                autoFocus
            />
            <Button 
                type='submit'
                size='icon'
                className='absolute rounded-full bottom-2 right-2 h-8 w-8 cursor-pointer'
            >
                <Send className="self-center"/>
            </Button>
        </form>
    )
}