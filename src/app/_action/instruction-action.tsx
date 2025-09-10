"use server";
import prisma from "@/db/store";
import { Instructions } from "@/../generated/prisma";

export async function getInstructions(): Promise<Instructions[]> {
	return await prisma.instructions.findMany();
}

export async function getInstructionByRecipeId(recipeid: number) {
	return await prisma.instructions.findFirst({
		where: { recipeId: recipeid },
	});
}

export async function createInstruction(instructions: any) {
    return await prisma.instructions.create({
        data: {
            step: instructions[0],
            content: instructions[1],
            recipeId: instructions[2],
        },
    });
}

export async function updateInstruction(id: number, instructions: any) {
    return await prisma.instructions.update({
        where: { id: id },
        data: {
            step: instructions[0],
            content: instructions[1],
            recipeId: instructions[2],
        },
    });
}

export async function deleteInstruction(id: number) {
    return await prisma.instructions.delete({
        where: { id: id },
    });
}