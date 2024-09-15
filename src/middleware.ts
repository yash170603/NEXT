import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";


export async function middleware(request: NextRequest) {
  const token = await getToken( {req: request} );
  const url = request.nextUrl;
  console.log(`This is being logged form middleware, the next printed thing will be token if, exits only,`,token);
  console.log(token)

  if (
    (token &&
         (url.pathname.startsWith("/sign-in") ||
         url.pathname.startsWith("/sign-up") ||
         url.pathname.startsWith("/verify") ||
         url.pathname.startsWith("/")
  ))) {
      return NextResponse.rewrite(new URL("/dashboard ", request.url));
     //router.replace('/dashboard')
  } 

     if(!token && (url.pathname.startsWith('/dashboard')) ){
      return NextResponse.redirect(new URL('/sign-in',request.url))
     }

     return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up" ,"/", "/dashboard/:path*", "/verfiy/:path*"],
}
