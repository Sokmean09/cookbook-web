"use server";
import prisma from "@/db/store";
import { Gallery } from "@/../generated/prisma";

export async function getGallery(): Promise<Gallery[]> {
	return await prisma.gallery.findMany();
}

export async function getGalleryByRecipeId(recipeid: number) {
	return await prisma.gallery.findFirst({
		where: { recipeId: recipeid },
	});
}

export async function createGallery(gallery: any) {
    return await prisma.gallery.create({
        data: {
            image: gallery[0],
            recipeId: gallery[1],
        },
    });
}

export async function updateGallery(id: number, gallery: any) {
    return await prisma.gallery.update({
        where: { id: id },
        data: {
            image: gallery[0],
            recipeId: gallery[1],
        },
    });
}

export async function deleteGallery(id: number) {
    return await prisma.gallery.delete({
        where: { id: id },
    });
}