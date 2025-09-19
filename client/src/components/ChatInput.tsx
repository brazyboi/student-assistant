import { useState } from 'react';
import { Button } from '@mui/material';

// import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send';

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
            <input
                className="border rounded-3xl p-4 w-full"
                autoFocus
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Enter your message...'
            />
            {/* <button
                type='submit'
                className='px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600'
            >
                Send
            </button> */}
            <Button 
                variant="contained" 
                type="submit"
                sx = {{ borderRadius: '24px' }}
            >
                <SendIcon />
            </Button>
        </form>
    )
}