import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // logged in -> let the page open
  return NextResponse.next();
}

// Only these (private) pages are checked
export const config = {
  matcher: ["/create-event", "/manage-events", "/joined-events"],
};