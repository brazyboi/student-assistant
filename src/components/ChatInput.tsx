import { useState } from 'react';

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
        <form onSubmit={handleSubmit}>
            <input
                autoFocus
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
        </form>
    )
}