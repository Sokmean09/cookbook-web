"use server";
import prisma from "@/db/store";
import { Ingredients } from "@/../generated/prisma";

export async function getIngredients(): Promise<Ingredients[]> {
	return await prisma.ingredients.findMany();
}

export async function getIngredientByRecipeId(recipeid: number) {
	return await prisma.ingredients.findMany({
		where: { recipeId: recipeid },
	});
}

export async function createIngredient(ingredients: Ingredients) {
    return await prisma.ingredients.create({
        data: {
            name: ingredients.name,
            quantity: ingredients.quantity,
            recipeId: ingredients.recipeId,
        },
    });
}

export async function updateIngredient(id: number, ingredients: Ingredients) {
    return await prisma.ingredients.update({
        where: { id: id },
        data: {
            name: ingredients.name,
            quantity: ingredients.quantity,
            recipeId: ingredients.recipeId,
        },
    });
}

export async function deleteIngredient(id: number) {
    return await prisma.ingredients.delete({
        where: { id: id },
    });
}