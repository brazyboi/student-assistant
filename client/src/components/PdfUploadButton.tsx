import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function PdfUpload() {
  const [uploadStatus, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
        setStatus('error');
        return; // Stop here, don't upload
    }

    setStatus('uploading');

    try {
      const { data: session } = await supabase.auth.getSession(); 
      if (!session) { 
        throw new Error("No session found");
      }

      const token = session.session?.access_token;

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('${API_URL}/api/upload-pdf', {
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

    } catch (err: any) {
      console.error(err);
      setStatus('error');
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
          {uploadStatus === 'idle' && ''}
          {uploadStatus === 'uploading' && 'Uploading...'}
          {uploadStatus === 'success' && '✓ Uploaded'}
          {uploadStatus === 'error' && '⚠ Failed'}
        </span>
      </Button>
    </label>
  );
}