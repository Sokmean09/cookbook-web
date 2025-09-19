"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecipeCardSkeleton } from "./recipeCardSkeleton";
import { getRecipes } from "@/app/_action/recipes-action";
import { Recipes } from "../../../../generated/prisma";
import Link from "next/link";

export default function RecipesCardList() {
	const [recipes, setRecipes] = useState<Recipes[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAll, setShowAll] = useState(false);

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				setLoading(true);
				const data = await getRecipes();
				setRecipes(data);
			} catch (error) {
				console.error("Failed to fetch recipes:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchRecipes();
	}, []);

	const displayedRecipes = showAll ? recipes : recipes.slice(0, 4);

	return (
		<div className="space-y-6">
			{/* Recipe grid */}
			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{loading
					? Array.from({ length: 4 }).map((_, idx) => (
						<RecipeCardSkeleton key={idx} />
					))
					: displayedRecipes.map((recipe) => (
						<Link key={recipe.id} href={`/recipe/${recipe.slug}`}>
							<Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-transform duration-100 hover:scale-101">
								<div className="relative sm:h-48 md:h-58 lg:h-72 h-80 transition-all w-full">
								<Image
									src={
									recipe.image && recipe.image.trim() !== ""
										? recipe.image
										: "/no-image.jpg"
									}
									alt={recipe.name || "Recipe image"}
									fill
									sizes="(max-width: 640px) 100vw,
										(max-width: 768px) 50vw,
										(max-width: 1024px) 33vw,
										25vw"
									className="object-cover"
									priority
								/>
								</div>
								<CardContent className="p-2 text-center">
								<h3 className="text-lg font-semibold">{recipe.name}</h3>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>

			{/* Toggle button only if more than 4 recipes */}
			{!loading && recipes.length > 4 && (
				<div className="flex justify-center">
					<Button
						variant="outline"
						onClick={() => setShowAll(!showAll)}
					>
						{showAll ? "Show Less" : "Show All"}
					</Button>
				</div>
			)}
		</div>
	);
}
