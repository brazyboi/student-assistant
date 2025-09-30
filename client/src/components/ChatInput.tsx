import { useState } from 'react';
import { Button, TextField } from '@mui/material';

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
            <TextField
                variant="outlined"
                autoComplete='off'
                className="w-full"
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Enter problem...'
                multiline
                rows={5}
                maxRows={10}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderWidth: 2,
                            borderColor: 'gray'
                        }

                    }
                }}
            />
            <Button 
                variant="contained" 
                type="submit"
                size='large'
                sx = {{ 
                    alignSelf: 'flex-start',
                }}
            >
                <SendIcon />
            </Button>
        </form>
    )
}