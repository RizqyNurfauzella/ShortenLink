'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnalyticsChart from '@/components/analytics-chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'react-hot-toast';

interface AnalyticsData {
  link: {
    shortUrl: string;
    originalUrl: string;
  };
  totalClicks: number;
  uniqueVisitors: number;
  clicksByDate: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  osBreakdown: Record<string, number>;
  referrerBreakdown: Record<string, number>;
}

export default function AnalyticsDetailPage() {
  const { shortCode } = useParams();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics/${shortCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const analyticsData: AnalyticsData = await response.json();
        setData(analyticsData);

        // Generate QR code
        const qr = await QRCode.toDataURL(`${window.location.origin}/r/${analyticsData.link.shortUrl}`);
        setQrCodeUrl(qr);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (shortCode) {
      fetchData();
    }
  }, [shortCode]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error || !data) {
    return <div className="container mx-auto p-4">Error: {error}</div>;
  }

  const lineData = Object.entries(data.clicksByDate)
    .map(([date, clicks]) => ({ name: date, clicks }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const deviceData = Object.entries(data.deviceBreakdown).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(data.browserBreakdown).map(([name, value]) => ({ name, value }));
  const osData = Object.entries(data.osBreakdown).map(([name, value]) => ({ name, value }));

  const referrerData = Object.entries(data.referrerBreakdown)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count);

  const handleExportData = () => {
    // Prepare CSV data
    const csvHeaders = ['Date', 'Clicks', 'Device', 'Browser', 'OS', 'Referrer', 'IP', 'Country'];
    const csvRows = [];

    // Add summary data
    csvRows.push(['Summary']);
    csvRows.push(['Total Clicks', data.totalClicks]);
    csvRows.push(['Unique Visitors', data.uniqueVisitors]);
    csvRows.push(['']);

    // Add clicks by date
    csvRows.push(['Clicks by Date']);
    Object.entries(data.clicksByDate).forEach(([date, clicks]) => {
      csvRows.push([date, clicks]);
    });
    csvRows.push(['']);

    // Add device breakdown
    csvRows.push(['Device Breakdown']);
    Object.entries(data.deviceBreakdown).forEach(([device, count]) => {
      csvRows.push([device, count]);
    });
    csvRows.push(['']);

    // Add browser breakdown
    csvRows.push(['Browser Breakdown']);
    Object.entries(data.browserBreakdown).forEach(([browser, count]) => {
      csvRows.push([browser, count]);
    });
    csvRows.push(['']);

    // Add OS breakdown
    csvRows.push(['OS Breakdown']);
    Object.entries(data.osBreakdown).forEach(([os, count]) => {
      csvRows.push([os, count]);
    });
    csvRows.push(['']);

    // Add referrer breakdown
    csvRows.push(['Referrer Breakdown']);
    Object.entries(data.referrerBreakdown).forEach(([referrer, count]) => {
      csvRows.push([referrer, count]);
    });

    // Convert to CSV
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${data.link.shortUrl}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto p-6">
        <nav className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Analytics Link
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Monitor your link performance and statistics
            </p>
          </div>
          <Button
            onClick={handleExportData}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </nav>

      {/* Header */}
      <Card className="mb-8 glass rounded-2xl border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-500/10 dark:bg-blue-400/10 rounded-full p-2">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Link Analytics</h2>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">Short URL</p>
                <p className="text-lg font-mono font-semibold text-blue-900 dark:text-blue-100 break-all">
                  {data.link.shortUrl}
                </p>
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Original URL</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 break-all bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  {data.link.originalUrl}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-100 rounded-xl p-4 shadow-lg relative group">
              <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = qrCodeUrl;
                  link.download = `qrcode-${data.link.shortUrl.split('/').pop()}.png`;
                  link.click();
                  toast.success('QR Code downloaded successfully!');
                }}
                className="absolute -bottom-2 -right-2 bg-green-600 hover:bg-green-700 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                size="sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="glass rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 dark:bg-blue-400/10 rounded-xl p-3">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Clicks</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{data.totalClicks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 dark:bg-green-400/10 rounded-xl p-3">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unique Visitors</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{data.uniqueVisitors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/10 dark:bg-purple-400/10 rounded-xl p-3">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Click Rate</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {data.uniqueVisitors > 0 ? (data.totalClicks / data.uniqueVisitors).toFixed(2) : '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500/10 dark:bg-orange-400/10 rounded-xl p-3">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Top Referrer</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                  {referrerData[0] ? referrerData[0].referrer : 'None'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {referrerData[0] ? `${referrerData[0].count} clicks` : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        <Card className="glass rounded-2xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-blue-500/10 dark:bg-blue-400/10 rounded-lg p-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Daily Click Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <AnalyticsChart
              type="line"
              data={lineData}
              dataKey="clicks"
              xAxisKey="name"
            />
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-green-500/10 dark:bg-green-400/10 rounded-lg p-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <AnalyticsChart type="pie" data={deviceData} dataKey="value" />
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-purple-500/10 dark:bg-purple-400/10 rounded-lg p-2">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              Browser Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <AnalyticsChart type="pie" data={browserData} dataKey="value" />
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-orange-500/10 dark:bg-orange-400/10 rounded-lg p-2">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              Operating System Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <AnalyticsChart type="pie" data={osData} dataKey="value" />
          </CardContent>
        </Card>
      </div>

      {/* Referrer Table */}
      <Card className="glass rounded-2xl border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="bg-indigo-500/10 dark:bg-indigo-400/10 rounded-lg p-2">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            Referrer Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <TableHead className="font-semibold text-slate-900 dark:text-white">Source</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-white text-right">Click Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrerData.length > 0 ? (
                  referrerData.map((item, index) => (
                    <TableRow key={item.referrer} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-slate-400' :
                            index === 2 ? 'bg-orange-500' :
                            'bg-slate-300'
                          }`} />
                          {item.referrer}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                        {item.count}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No referrer data yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}