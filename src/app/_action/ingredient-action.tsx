"use server";
import prisma from "@/db/store";
import { Ingredients } from "@/../generated/prisma";

export async function getIngredients(): Promise<Ingredients[]> {
	return await prisma.ingredients.findMany();
}

export async function getIngredientByRecipeId(recipeid: number) {
	return await prisma.ingredients.findFirst({
		where: { recipeId: recipeid },
	});
}

export async function createIngredient(ingredients: any) {
    return await prisma.ingredients.create({
        data: {
            name: ingredients[0],
            quantity: ingredients[1],
            recipeId: ingredients[2],
        },
    });
}

export async function updateIngredient(id: number, ingredients: any) {
    return await prisma.ingredients.update({
        where: { id: id },
        data: {
            name: ingredients[0],
            quantity: ingredients[1],
            recipeId: ingredients[2],
        },
    });
}

export async function deleteIngredient(id: number) {
    return await prisma.ingredients.delete({
        where: { id: id },
    });
}