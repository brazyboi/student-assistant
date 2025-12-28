import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export default function Notepad() {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('notepad');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem('notepad', newNotes);
  };

  return (
    <Card className="flex flex-col h-full bg-background border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3 text-foreground">Quick Notes</h3>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="Write your notes here..."
        className="flex-1 p-3 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder-muted-foreground"
      />
    </Card>
  );
}
