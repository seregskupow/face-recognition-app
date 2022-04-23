import { AuthService } from '@/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log({ IsAuth: await AuthService.checkAuthMiddleware(req) });
  if (await AuthService.checkAuthMiddleware(req)) {
    return NextResponse.redirect('/');
  }
  return NextResponse.next();
}
