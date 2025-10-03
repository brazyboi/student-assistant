import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react';

export default function ChatInput({ onSend }: { onSend: (message: string) => void; }) {
    const [message, setMessage] = React.useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        el.style.height = `${el.scrollHeight}px`
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const text = message.trim();
        if (!text) return;
        onSend(text);
        setMessage('');
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="relative mt-2 justify-center w-full"
        >
            <Textarea
                ref={textareaRef}
                rows={1}
                onInput={handleInput}
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
                className='absolute rounded-full bottom-2 right-2 h-8 w-8'
            >
                <Send className="self-center"/>
            </Button>
        </form>
    )
}