import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../lib/prisma';
import { shortenUrlSchema } from '../../../lib/validators';
import { nanoid } from 'nanoid';
import qrcode from 'qrcode';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
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

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const { url } = shortenUrlSchema.parse(body);

    // Check if URL already shortened
    const existingLink = await prisma.link.findFirst({
      where: { originalUrl: url },
    });

    if (existingLink) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000/';
      const fullUrl = baseUrl + 'r/' + existingLink.shortUrl;
      const qrCode = await qrcode.toDataURL(fullUrl);
      return NextResponse.json({
        success: true,
        data: {
          id: existingLink.id,
          originalUrl: existingLink.originalUrl,
          shortCode: existingLink.shortUrl,
          shortUrl: fullUrl,
          qrCode
        }
      });
    }

    // Generate unique short code
    let shortCode = nanoid(8);
    while (await prisma.link.findUnique({ where: { shortUrl: shortCode } })) {
      shortCode = nanoid(8);
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000/';
    const fullUrl = baseUrl + 'r/' + shortCode;
    const qrCode = await qrcode.toDataURL(fullUrl);

    // Save to database
    const newLink = await prisma.link.create({
      data: {
        originalUrl: url,
        shortUrl: shortCode,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newLink.id,
        originalUrl: newLink.originalUrl,
        shortCode: newLink.shortUrl,
        shortUrl: fullUrl,
        qrCode
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}