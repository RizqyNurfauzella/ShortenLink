import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnalyticsChart from '@/components/analytics-chart';
import AnalyticsTable from '@/components/analytics-table';

export default async function AnalyticsPage() {
  const links = await prisma.link.findMany({
    include: { analytics: true },
  });

  // Filter analytics for last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  let totalClicks = 0;
  const allIps = new Set<string>();
  const referrers = new Map<string, number>();
  const devices = new Map<string, number>();
  const countries = new Map<string, number>();
  const clicksByDate = new Map<string, number>();
  const linkStats: {
    shortUrl: string;
    originalUrl: string;
    totalClicks: number;
    uniqueVisitors: number;
    createdAt: string;
  }[] = [];

  for (const link of links) {
    const analytics = link.analytics.filter((a: any) => a.timestamp >= thirtyDaysAgo);
    totalClicks += analytics.length;
    const ips = new Set<string>();
    for (const a of analytics) {
      if (a.ip) {
        ips.add(a.ip);
        allIps.add(a.ip);
      }
      if (a.referrer) {
        referrers.set(a.referrer, (referrers.get(a.referrer) || 0) + 1);
      }
      if (a.device) {
        devices.set(a.device, (devices.get(a.device) || 0) + 1);
      }
      if (a.country) {
        countries.set(a.country, (countries.get(a.country) || 0) + 1);
      }
      const date = a.timestamp.toISOString().split('T')[0];
      clicksByDate.set(date, (clicksByDate.get(date) || 0) + 1);
    }
    linkStats.push({
      shortUrl: link.shortUrl,
      originalUrl: link.originalUrl,
      totalClicks: analytics.length,
      uniqueVisitors: ips.size,
      createdAt: link.createdAt.toISOString().split('T')[0],
    });
  }

  const uniqueVisitors = allIps.size;
  const clickRate = uniqueVisitors > 0 ? (totalClicks / uniqueVisitors).toFixed(2) : '0';
  const topReferrers = Array.from(referrers.entries()).sort((a, b) => b[1] - a[1]);
  const topReferrer = topReferrers[0] ? `${topReferrers[0][0]} (${topReferrers[0][1]})` : 'None';

  const lineData = Array.from(clicksByDate.entries())
    .map(([date, clicks]) => ({ name: date, clicks }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const pieData = Array.from(devices.entries()).map(([device, count]) => ({
    name: device,
    value: count,
  }));

  const barData = Array.from(countries.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ name: country, count }));

  return (
    <div className="container mx-auto p-4">
      <nav className="mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalClicks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{uniqueVisitors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clickRate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Referrer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{topReferrer}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              type="line"
              data={lineData}
              dataKey="clicks"
              xAxisKey="name"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart type="pie" data={pieData} dataKey="value" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart
              type="bar"
              data={barData}
              dataKey="count"
              xAxisKey="name"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Links Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsTable data={linkStats} />
        </CardContent>
      </Card>
    </div>
  );
}