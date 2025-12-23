'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Copy, Download, Plus, BarChart3 } from 'lucide-react';

interface LinkResultProps {
  originalUrl: string;
  shortUrl: string;
  qrCodeBase64: string;
  onCreateAnother: () => void;
  onViewAnalytics: () => void;
}

export default function LinkResult({
  originalUrl,
  shortUrl,
  qrCodeBase64,
  onCreateAnother,
  onViewAnalytics,
}: LinkResultProps) {
  const truncateUrl = (url: string) => {
    return url.length > 50 ? url.substring(0, 50) + '...' : url;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeBase64.startsWith('data:') ? qrCodeBase64 : `data:image/png;base64,${qrCodeBase64}`;
    link.download = 'qrcode.png';
    link.click();
    toast.success('QR Code downloaded!');
  };

  return (
    <div className="glass rounded-3xl p-8 max-w-lg mx-auto animate-scale-in shadow-2xl border border-white/20 dark:border-slate-700/20">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          Link Shortened Successfully!
        </h2>
      </div>

      <div className="space-y-6">
        <div className="animate-slide-in-right">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Original URL
          </label>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-sm break-all text-slate-700 dark:text-slate-300 font-mono">
              {truncateUrl(originalUrl)}
            </p>
          </div>
        </div>

        <div className="animate-slide-in-right animation-delay-200">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Short URL
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm break-all text-blue-900 dark:text-blue-100 font-mono font-semibold">
                {shortUrl}
              </p>
            </div>
            <Button
              onClick={handleCopy}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-3 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="animate-slide-in-right animation-delay-400">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            QR Code
          </label>
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="bg-white dark:bg-slate-100 rounded-lg p-2 shadow-sm">
              <img
                src={qrCodeBase64.startsWith('data:') ? qrCodeBase64 : `data:image/png;base64,${qrCodeBase64}`}
                alt="QR Code"
                className="w-20 h-20"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Scan this QR code to access your shortened link
              </p>
              <Button
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 animate-fade-in animation-delay-600">
        <Button
          onClick={onCreateAnother}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl py-3 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Another
        </Button>
        <Button
          onClick={onViewAnalytics}
          variant="outline"
          className="flex-1 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-xl py-3 transition-all duration-200 hover:scale-105"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  );
}