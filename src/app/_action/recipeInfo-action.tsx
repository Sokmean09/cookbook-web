"use server";
import prisma from "@/db/store";
import { RecipeInfo } from "../../../generated/prisma";

export async function getRecipeInfo(): Promise<RecipeInfo[]> {
    return await prisma.recipeInfo.findMany();
}

export async function getRecipeInfoByRecipeId(recipeid: number) {
    return await prisma.recipeInfo.findFirst({
        where: { recipeId: recipeid },
    });
}

export async function createRecipeInfo(recipeInfo: any) {
    return await prisma.recipeInfo.create({
        data: {
            prepTime: recipeInfo[0],
            cookTime: recipeInfo[1],
            servings: recipeInfo[2],
            recipeId: recipeInfo[3],
        },
    });
}

export async function updateRecipeInfo(id: number, recipeInfo: any) {
    return await prisma.recipeInfo.update({
        where: {id: id},
        data: {
            prepTime: recipeInfo[0],
            cookTime: recipeInfo[1],
            servings: recipeInfo[2],
            recipeId: recipeInfo[3],
        },
    });
}

export async function deleteRecipeInfo(id: number) {
    return await prisma.recipeInfo.delete({
        where: { id: id },
    });
}