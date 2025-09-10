"use client";

import { useEffect, useState } from "react";
import { getRecipeBySlug } from "@/app/_action/recipes-action";
import { getGalleryByRecipeId } from "@/app/_action/gallery-action";
import { Gallery, Ingredients, Instructions, RecipeInfo } from "../../../../../generated/prisma";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { getIngredientByRecipeId } from "@/app/_action/ingredient-action";
import { getInstructionByRecipeId } from "@/app/_action/instruction-action";
import { getRecipeInfoByRecipeId } from "@/app/_action/recipeInfo-action";

export default function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  const [recipe, setRecipe] = useState<any>(null);
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [ingredient, setIngredient] = useState<Ingredients[]>([]);
  const [instruction, setInstruction] = useState<Instructions[]>([]);
  const [recipeInfo, setRecipeInfo] = useState<RecipeInfo>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecipeBySlug(slug);
      setRecipe(data);

      if (data?.id) {
        const galleryData = await getGalleryByRecipeId(data.id);
        if (galleryData) {
          setGallery(Array.isArray(galleryData) ? galleryData : [galleryData]);
        }
        
        const ingredientData = await getIngredientByRecipeId(data.id);
        if (ingredientData) {
          setIngredient(Array.isArray(ingredientData) ? ingredientData : [ingredientData]);
        }

        const instructionData = await getInstructionByRecipeId(data.id);
        if (instructionData) {
          setInstruction(Array.isArray(instructionData) ? instructionData : [instructionData]);
        }

        const recipeInfoData = await getRecipeInfoByRecipeId(data.id);
        if (recipeInfoData) {
          setRecipeInfo(recipeInfoData);
        }

      }
    };

    fetchData();
  }, [slug]);

    if (!recipe) {
        return (
        <div className="flex h-[60vh] items-center justify-center">
            <Card className="p-6 text-center">
            <h2 className="text-2xl font-semibold">Loading Recipe...</h2>
            </Card>
        </div>
        );
    }

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      {/* Back Button */}
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/recipes">← Back to Recipes</Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="mb-10">
        <div className="relative h-[350px] w-full overflow-hidden rounded-2xl shadow-md">
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </div>

        <h1 className="mt-6 text-4xl font-bold">{recipe.name}</h1>
        {recipe.theme && (
          <Badge className="mt-2 text-base px-4 py-1">{recipe.theme}</Badge>
        )}
        {recipe.description && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {recipe.description}
          </p>
        )}
      </div>

      <Separator className="my-8" />

      {/* Ingredients */}
      {ingredient?.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Ingredients</h2>
          <ul className="list-disc pl-6 space-y-2">
            {ingredient.map((ingre, idx) => (
              <li key={idx} className="text-base text-muted-foreground">
                {ingre.name}{" "}
                {ingre.quantity && `- ${ingre.quantity}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator className="my-8" />

      {/* Instructions */}
      {instruction?.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Instructions</h2>
          <ol className="list-decimal pl-6 space-y-4">
            {instruction.map((step, idx) => (
              <li
                key={idx}
                className="text-base leading-relaxed text-muted-foreground"
              >
                {step.content}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Gallery */}
      {gallery?.length > 0 && (
        <>
          <Separator className="my-8" />
          <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((img, idx) => (
              <Card key={idx} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={img.image}
                      alt={`Gallery ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Extra Recipe Info */}
      {recipeInfo && (
        <>
          <Separator className="my-8" />
          <h2 className="mb-4 text-2xl font-semibold">Additional Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-semibold">Prep Time:</span>{" "}
                  {recipeInfo.prepTime || "N/A"} {"minutes"}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Cook Time:</span>{" "}
                  {recipeInfo.cookTime || "N/A"} {"minutes"}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold">Servings:</span>{" "}
                  {recipeInfo.servings || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
