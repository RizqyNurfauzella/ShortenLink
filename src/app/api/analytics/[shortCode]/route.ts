import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

interface Params {
  shortCode: string;
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per window for analytics
const WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { shortCode } = await params;

    const link = await prisma.link.findUnique({
      where: { shortUrl: shortCode },
      include: { analytics: true },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const analytics = link.analytics;
    const totalClicks = analytics.length;
    const uniqueVisitors = new Set(
      analytics.map((a: any) => a.ip).filter(Boolean)
    ).size;

    const clicksByDate = analytics.reduce((acc: Record<string, number>, a: any) => {
      const date = a.timestamp.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const deviceBreakdown = analytics.reduce((acc: Record<string, number>, a: any) => {
      const device = a.device || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    const browserBreakdown = analytics.reduce((acc: Record<string, number>, a: any) => {
      const browser = a.browser || 'Unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});

    const referrerBreakdown = analytics.reduce((acc: Record<string, number>, a: any) => {
      const referrer = a.referrer || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {});

    // Simple OS parsing from userAgent
    const osBreakdown = analytics.reduce((acc: Record<string, number>, a: any) => {
      const ua = a.userAgent || '';
      let os = 'Unknown';
      if (ua.includes('Windows')) os = 'Windows';
      else if (ua.includes('Mac')) os = 'macOS';
      else if (ua.includes('Linux')) os = 'Linux';
      else if (ua.includes('Android')) os = 'Android';
      else if (ua.includes('iOS')) os = 'iOS';
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      link: {
        shortUrl: link.shortUrl,
        originalUrl: link.originalUrl,
      },
      totalClicks,
      uniqueVisitors,
      clicksByDate,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      referrerBreakdown,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}