import { AuthService } from '@/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  //console.log({ cookies: req.cookies });
  console.log({ Middle: await AuthService.checkAuthMiddleware(req) });
  if (!(await AuthService.checkAuthMiddleware(req))) {
    return NextResponse.redirect('/auth/login');
  }
  return NextResponse.next();
}
