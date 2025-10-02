import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'

export default function ChatInput({
    onSend,
}: {
    onSend: (message: string) => void;
}) {
    const [message, setMessage] = useState('');

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
        className="gap-2 bottom-0 left-0 right-0 mb-8 mt-4 flex justify-center w-full"
        >
            <Textarea
                autoComplete='off'
                className="w-full border-2 border-secondary"
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Enter problem...'
                // rows={5}
            />
            <Button 
                type='submit'
                size='lg'
                className='self-start'
            >
                Send
            </Button>
        </form>
    )
}