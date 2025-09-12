import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";
import { getUserByEmail } from "@/app/_action/user-action";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await getUserByEmail(email);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Compare hashed password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // create session cookie
  await createSession(user.id.toString());

  const authToken = Math.random().toString(36).substring(2);

  return NextResponse.json({ authToken, user });
}
