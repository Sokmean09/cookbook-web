import { NextResponse } from "next/server"
import { deleteSession, getSession } from "@/lib/session"
import { deleteUser, updateUser } from "@/app/_action/user-action";
import bcrypt from "bcryptjs";
import { Users } from "../../../../generated/prisma";

export async function POST(req: Request) {
    try {
        const session = await getSession()
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json();
        const { id, name, email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await updateUser(id, {
            name: name ?? "",
            email,
            password: hashedPassword,
        } as Users);

        return NextResponse.json(
            { message: "Account update successfully", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST /api/account error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getSession()
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        };

        await deleteUser(Number(session.userId))
        await deleteSession()

        return NextResponse.json(
            { message: "Account deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE /api/account error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
