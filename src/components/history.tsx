'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ExternalLink, BarChart3, Trash2, QrCode, X, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface HistoryEntry {
  id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  qrCode: string;
  createdAt: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; qrCode: string; shortUrl: string }>({
    isOpen: false,
    qrCode: '',
    shortUrl: ''
  });

  useEffect(() => {
    const updateHistory = () => {
      const savedHistory = JSON.parse(localStorage.getItem('shortenHistory') || '[]');
      setHistory(savedHistory);
    };

    updateHistory();

    // Listen for history updates
    window.addEventListener('historyUpdated', updateHistory);

    return () => {
      window.removeEventListener('historyUpdated', updateHistory);
    };
  }, []);

  const handleViewAnalytics = (shortCode: string) => {
    window.open(`/analytics/${shortCode}`, '_blank');
  };

  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem('shortenHistory', JSON.stringify(newHistory));
    window.dispatchEvent(new CustomEvent('historyUpdated'));
    toast.success('Link removed from history');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('shortenHistory');
    window.dispatchEvent(new CustomEvent('historyUpdated'));
    toast.success('History cleared');
  };

  const handleViewQR = (qrCode: string, shortUrl: string) => {
    setQrModal({ isOpen: true, qrCode, shortUrl });
  };

  const handleDownloadQR = (qrCode: string, shortUrl: string) => {
    const link = document.createElement('a');
    link.href = qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`;
    link.download = `qrcode-${shortUrl.split('/').pop()}.png`;
    link.click();
    toast.success('QR Code downloaded successfully!');
  };

  const closeQrModal = () => {
    setQrModal({ isOpen: false, qrCode: '', shortUrl: '' });
  };

  if (history.length === 0) {
    return null;
  }

  const truncateUrl = (url: string) => {
    return url.length > 40 ? url.substring(0, 40) + '...' : url;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-16 animate-fade-in animation-delay-1000">
      <Card className="glass rounded-2xl border-0 shadow-xl">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-indigo-500/10 dark:bg-indigo-400/10 rounded-lg p-2">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              Link History
              <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm px-3 py-1 rounded-full font-medium">
                {history.length}
              </span>
            </CardTitle>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                {isExpanded ? 'Hide History' : 'Show History'}
              </Button>
              <Button
                onClick={clearHistory}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 rounded-xl transition-all duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Original URL
                          </p>
                          <p className="text-sm text-slate-900 dark:text-slate-100 break-all font-medium">
                            {truncateUrl(entry.originalUrl)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Short Link
                          </p>
                          <p className="text-sm font-mono font-semibold text-blue-900 dark:text-blue-100 break-all">
                            {entry.shortUrl}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                            Created
                          </p>
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                      <Button
                        onClick={() => handleCopy(entry.shortUrl)}
                        size="sm"
                        variant="outline"
                        className="rounded-lg px-4 py-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                      >
                        Copy Link
                      </Button>
                      <Button
                        onClick={() => handleViewQR(entry.qrCode, entry.shortUrl)}
                        size="sm"
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg px-4 py-2 transition-all duration-200"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        QR Code
                      </Button>
                      <Button
                        onClick={() => handleViewAnalytics(entry.shortCode)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                      <Button
                        onClick={() => handleDelete(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 rounded-lg px-4 py-2 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* QR Code Modal */}
      {qrModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">QR Code</h3>
              <Button
                onClick={closeQrModal}
                variant="ghost"
                size="sm"
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center">
              <div className="bg-white dark:bg-slate-100 rounded-xl p-4 mb-4 inline-block shadow-lg">
                <img
                  src={qrModal.qrCode.startsWith('data:') ? qrModal.qrCode : `data:image/png;base64,${qrModal.qrCode}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 break-all">
                {qrModal.shortUrl}
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleDownloadQR(qrModal.qrCode, qrModal.shortUrl)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                </Button>
                <Button
                  onClick={() => handleCopy(qrModal.shortUrl)}
                  variant="outline"
                  className="flex-1 rounded-xl py-3 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}