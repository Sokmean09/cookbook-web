"use server";
import prisma from "@/db/store";
import { Recipes } from "@/../generated/prisma";
import { slugify } from "@/utils/slugify";

export async function getRecipes(): Promise<Recipes[]> {
	return await prisma.recipes.findMany();
}

export async function getRecipe(id: number) {
	return await prisma.recipes.findUnique({
		where: { id: id },
	});
}

export async function getRecipeBySlug(slug: string) {
	return await prisma.recipes.findUnique({
		where: { slug: slug },
	});
}

export async function createRecipe(recipe: Recipes) {
	return await prisma.recipes.create({
		data: {
			name: recipe.name,
			slug: slugify(recipe.name),
			description: recipe.description,
			image: recipe.image,
			theme: recipe.theme,
		},
	});
}

export async function updateRecipe(id: number, recipe: Recipes) {
	return await prisma.recipes.update({
		where: { id: id },
		data: {
			name: recipe.name,
			slug: slugify(recipe.name),
			description: recipe.description,
			image: recipe.image,
			theme: recipe.theme,
		},
	});
}

export async function deleteRecipe(id: number) {
    return await prisma.recipes.delete({
        where: { id: id },
    });
}
