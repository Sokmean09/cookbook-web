// fix for api/auth.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { getUserById } from "@/app/_action/user-action"

function generateAuthToken() {
  return Math.random().toString(36).substring(2)
}

export async function GET() {
  const cookie = (await cookies()).get("session")?.value
  const session = await decrypt(cookie)
  const currentUser = session ? await getUserById(Number(session.userId)) : null

  const authToken = generateAuthToken()

  return NextResponse.json({ authToken, user: currentUser })
}
