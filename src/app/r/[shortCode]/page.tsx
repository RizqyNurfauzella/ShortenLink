import { redirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';
import prisma from '../../../lib/prisma';

export default async function Page({ params }: { params: Promise<{ shortCode: string }> }) {
  const { shortCode } = await params;

  try {
    const link = await prisma.link.findUnique({
      where: { shortUrl: shortCode },
    });

    if (!link) {
      notFound();
    }

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || '';
    const referrer = headersList.get('referer') || '';

    // Simple device parsing
    let device = 'desktop';
    if (/Mobi|Android/i.test(userAgent)) device = 'mobile';
    else if (/Tablet|iPad/i.test(userAgent)) device = 'tablet';

    // Simple browser parsing
    let browser = 'unknown';
    if (/Chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
    else if (/Edge/i.test(userAgent)) browser = 'Edge';
    else if (/Opera/i.test(userAgent)) browser = 'Opera';

    // Country
    let country = null;
    if (ip !== 'unknown') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(`http://ipapi.co/${ip}/country/`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          country = await res.text();
        }
      } catch (e) {
        // optional
      }
    }

    // Log analytics
    await prisma.analytics.create({
      data: {
        linkId: link.id,
        ip,
        userAgent,
        referrer,
        device,
        browser,
        country,
      },
    });

    // Redirect
    redirect(link.originalUrl);
  } catch (error) {
    console.error('Error in redirect handler:', error);
    notFound();
  }
}