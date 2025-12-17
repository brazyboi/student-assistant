import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export function PdfUpload() {
  const [uploadStatus, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setMessage('Reading PDF and generating embeddings...');

    try {
      const { data: session } = await supabase.auth.getSession(); 
      if (!session) { 
        throw new Error("No session found");
      }

      const token = session.session?.access_token;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/api/upload-pdf', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setStatus('success');
      setMessage(data.message);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || "Failed to upload");
    }
  };

  return (
    <label className="cursor-pointer">
      <input 
        type="file" 
        accept=".pdf" 
        className="hidden" 
        onChange={handleFileChange}
        disabled={uploadStatus === 'uploading'}
      />
      <Button 
        asChild 
        variant={uploadStatus === 'success' ? 'default' : uploadStatus === 'error' ? 'destructive' : 'outline'}
        size="sm"
        className="w-full"
        onClick={(e) => {
          if (uploadStatus !== 'idle') {
            e.preventDefault();
          }
        }}
      >
        <span className="flex items-center justify-center gap-2">
          {uploadStatus === 'uploading' && (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
          )}
          {uploadStatus === 'idle' && <Upload className="w-4 h-4" />}
          {uploadStatus === 'idle' && 'Upload PDF'}
          {uploadStatus === 'uploading' && 'Uploading...'}
          {uploadStatus === 'success' && '✓ Uploaded'}
          {uploadStatus === 'error' && '⚠ Failed'}
        </span>
      </Button>
    </label>
  );
}