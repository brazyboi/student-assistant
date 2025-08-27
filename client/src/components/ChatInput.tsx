import { useState } from 'react';
import { sendMessage } from '../api/chat';

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
        sendMessage(text);
    }

    return (
        <form 
        onSubmit={handleSubmit} 
        className="fixed gap-2 bottom-0 left-0 right-0 p-4 border-t flex justify-center"
        >
            <input
                className="flex-1 border rounded-3xl p-4 w-full"
                autoFocus
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Enter your message...'
            />
            <button
                type='submit'
                className='px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600'
            >
                Send
            </button>
        </form>
    )
}