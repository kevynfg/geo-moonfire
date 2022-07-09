import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
    // console.log("middleware", request.headers);
    // if (!request.nextUrl.pathname.startsWith("/login")) {
    //     console.log('entrou')
    //     if (request.headers.get("Authorization") === null) { 
    //         return NextResponse.redirect(request.nextUrl.origin + "/login");
    //     }
    // }
    // return NextResponse.next();
}
