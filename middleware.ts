// import { type NextRequest, NextResponse } from "next/server"
import { getUserFromSession } from "./server/core/session"

// const privateRoutes = ["/investor"]
// const adminRoutes = ["/admin"]

// export async function middleware(request: NextRequest){
//     const response  = await middlewareAuth(request) ?? NextResponse.next()
//     return response
// }

// async function middlewareAuth(request: NextRequest) {
//   if (privateRoutes.includes(request.nextUrl.pathname)) {
//     const user = await getUserFromSession(request.cookies)
//     if (user == null) {
//       return NextResponse.redirect(new URL("/auth/login", request.url))
//     }
//   }

//   if (adminRoutes.includes(request.nextUrl.pathname)) {
//     const user = await getUserFromSession(request.cookies)
//     if (user == null) {
//       return NextResponse.redirect(new URL("/auth/login", request.url))
//     }
//     if (user.role !== "admin") {
//       return NextResponse.redirect(new URL("/", request.url))
//     }
//   }
// }


// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }



// import { type NextRequest, NextResponse } from "next/server"

// const privateRoutes = ["/investor"]
// const adminRoutes = ["/admin"]

// export async function middleware(request: NextRequest) {
//   const response = await middlewareAuth(request) ?? NextResponse.next()
//   return response
// }

// async function middlewareAuth(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   // very simple edge-safe "session"
//   const sessionToken = request.cookies.get("session-id")?.value
//   const role = request.cookies.get("role")?.value // e.g. "admin" | "user"

//   // Protect private routes
//   if (privateRoutes.some((route) => path.startsWith(route))) {
//     if (!sessionToken) {
//       return NextResponse.redirect(new URL("/auth/login", request.url))
//     }
//   }

//   // Protect admin routes
//   if (adminRoutes.some((route) => path.startsWith(route))) {
//     if (!sessionToken) {
//       return NextResponse.redirect(new URL("/auth/login", request.url))
//     }
//     if (role !== "admin") {
//       return NextResponse.redirect(new URL("/", request.url))
//     }
//   }

//   // no redirect → continue as normal
//   return undefined
// }

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }


import { type NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/investor"];
const adminRoutes = ["/admin"];
const COOKIE_SESSION_KEY = "session-id";

export async function middleware(request: NextRequest) {
  const res = (await middlewareAuth(request)) ?? NextResponse.next();
  return res;
}

async function middlewareAuth(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const sessionId = request.cookies.get(COOKIE_SESSION_KEY)?.value;
  const role = request.cookies.get("role")?.value;

  // Logged-in check
  if (privateRoutes.some((route) => path.startsWith(route))) {
    if (!sessionId) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Admin check
  if (adminRoutes.some((route) => path.startsWith(route))) {
    if (!sessionId) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return undefined;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
