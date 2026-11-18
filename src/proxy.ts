import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { isValidToken } from "@/lib/auth";

const handleI18n = createMiddleware(routing);

// Next.js 16：proxy = 原 middleware。前台走三语路由；/admin 做未登录乐观拦截
// （真正的权限校验仍在后台布局/Server Action 内 getCurrentAdmin 完成）。
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const ok = await isValidToken(request.cookies.get("admin_session")?.value);
    if (!ok) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  return handleI18n(request);
}

export const config = {
  // 跳过 api、_next 与静态文件
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
