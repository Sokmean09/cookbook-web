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

export async function createRecipeInfo(recipeInfo: RecipeInfo) {
    return await prisma.recipeInfo.create({
        data: {
            prepTime: recipeInfo.prepTime,
            cookTime: recipeInfo.cookTime,
            servings: recipeInfo.servings,
            recipeId: recipeInfo.recipeId,
        },
    });
}

export async function updateRecipeInfo(id: number, recipeInfo: RecipeInfo) {
    return await prisma.recipeInfo.update({
        where: {id: id},
        data: {
            prepTime: recipeInfo.prepTime,
            cookTime: recipeInfo.cookTime,
            servings: recipeInfo.servings,
            recipeId: recipeInfo.recipeId,
        },
    });
}

export async function deleteRecipeInfo(id: number) {
    return await prisma.recipeInfo.delete({
        where: { id: id },
    });
}