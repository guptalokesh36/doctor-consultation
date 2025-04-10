import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // change this later its just for trying out
  const response = NextResponse.next()
  const themePrefrenc = request.cookies.get("theme")
  const token = request.cookies.get("__session")?.value;
 

  if (!themePrefrenc) {
    response.cookies.set("theme", "dark")
  }
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
 return response;
}
export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/dashboard/:path*", "/patients/:path*"],
};