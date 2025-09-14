"use server";
import prisma from "@/db/store";
import { Instructions } from "@/../generated/prisma";

export async function getInstructions(): Promise<Instructions[]> {
	return await prisma.instructions.findMany();
}

export async function getInstructionByRecipeId(recipeid: number) {
	return await prisma.instructions.findMany({
		where: { recipeId: recipeid },
	});
}

export async function createInstruction(instructions: Instructions) {
    return await prisma.instructions.create({
        data: {
            step: instructions.step,
            content: instructions.content,
            recipeId: instructions.recipeId,
        },
    });
}

export async function updateInstruction(id: number, instructions: Instructions) {
    return await prisma.instructions.update({
        where: { id: id },
        data: {
            step: instructions.step,
            content: instructions.content,
            recipeId: instructions.recipeId,
        },
    });
}

export async function deleteInstruction(id: number) {
    return await prisma.instructions.delete({
        where: { id: id },
    });
}