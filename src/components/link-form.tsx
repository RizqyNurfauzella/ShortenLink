'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { shortenUrlSchema } from '@/lib/validators';
import LinkResult from './link-result';

interface ShortenedLink {
  originalUrl: string;
  shortUrl: string;
  qrCode: string;
}

export default function LinkForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShortenedLink | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      shortenUrlSchema.parse({ url });
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult({
          originalUrl: url,
          shortUrl: data.data.shortUrl,
          qrCode: data.data.qrCode,
        });

        // Save to localStorage for history
        const history = JSON.parse(localStorage.getItem('shortenHistory') || '[]');
        const newEntry = {
          id: data.data.id,
          originalUrl: url,
          shortUrl: data.data.shortUrl,
          shortCode: data.data.shortCode,
          qrCode: data.data.qrCode,
          createdAt: new Date().toISOString(),
        };

        // Add to beginning of array, keep only last 50 entries
        history.unshift(newEntry);
        if (history.length > 50) {
          history.splice(50);
        }

        localStorage.setItem('shortenHistory', JSON.stringify(history));
        // Dispatch custom event to update history in other components
        window.dispatchEvent(new CustomEvent('historyUpdated'));
        setUrl('');
      } else {
        toast.error(data.error || 'Failed to shorten URL');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setResult(null);
  };

  const handleViewAnalytics = () => {
    const shortCode = result?.shortUrl.split('/').pop();
    if (shortCode) {
      window.open(`/analytics/${shortCode}`, '_blank');
    }
  };

  if (result) {
    return (
      <LinkResult
        originalUrl={result.originalUrl}
        shortUrl={result.shortUrl}
        qrCodeBase64={result.qrCode}
        onCreateAnother={handleCreateAnother}
        onViewAnalytics={handleViewAnalytics}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
      <div className="flex-1 relative">
        <Input
          type="url"
          placeholder="Enter your long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-lg px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-lg"
          disabled={loading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Shortening...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Shorten URL
          </div>
        )}
      </Button>
    </form>
  );
}