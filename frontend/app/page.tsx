'use client';

import { useState } from 'react';
import { ImageIcon, Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg'];

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('Choose an image to remove the background.');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setStatus(
      selectedFile
        ? `Ready to process ${selectedFile.name}`
        : 'Choose an image to remove the background.'
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setStatus('Please select a PNG or JPG image before continuing.');
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setStatus('Only PNG and JPG files are supported.');
      return;
    }

    setIsLoading(true);
    setStatus('Uploading image and removing background...');

    const formData = new FormData();
    formData.append('image', file);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

    try {
      const response = await fetch(`${BACKEND_URL}/remove`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Unexpected processing error.');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `removed-${file.name.replace(/\.[^.]+$/, '')}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      setStatus('Background removed! Your download should start automatically.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="relative isolate overflow-hidden px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-soft backdrop-blur"> 
          <div className="mb-10 space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-2 text-sm text-sky-300 ring-1 ring-slate-700/70">
              <UploadCloud className="h-4 w-4" />
              Next.js + shadcn-style UI
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Remove Background Instantly</h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Upload any PNG or JPG and receive a transparent PNG with the background removed.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload your image</CardTitle>
              <CardDescription>We process the file on the server and return a transparent PNG.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <label htmlFor="image" className="text-sm font-medium text-slate-200">
                    Select an image
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleFileChange}
                    className="rounded-3xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-50 file:mr-4 file:rounded-full file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-300">{status}</p>
                  <Button type="submit" disabled={isLoading} className={cn('w-full sm:w-auto', isLoading && 'cursor-wait')}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Processing...' : 'Remove Background'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
