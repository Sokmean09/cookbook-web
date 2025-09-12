"use server";
import prisma from "@/db/store";
import { Users } from "@/../generated/prisma";

export async function getUsers(): Promise<Users[]> {
    return await prisma.users.findMany();
}

export async function getUserById(id: number) {
    return await prisma.users.findUnique({
		where: { id: id },
	});
}

export async function getUserByEmail(email: string) {
    return await prisma.users.findUnique({
		where: { email: email },
	});
}

export async function createUser(user: Users) {
    return await prisma.users.create({
        data: {
            name: user.name,
            email: user.email,
            role: user.role,
            password: user.password,
        },
    });
}

export async function updateUser(id: number, user: Users) {
    return await prisma.users.update({
        where: { id: id },
        data: {
            name: user.name,
            email: user.email,
            role: user.role,
            password: user.password,
        },
    });
}

export async function deleteUser(id: number) {
    return await prisma.users.delete({
        where: { id: id },
    });
}