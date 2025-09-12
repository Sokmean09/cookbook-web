"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getRandomRecipes } from "../_action/recipes-action";
import { useEffect, useState } from "react";
import { Recipes } from "../../../generated/prisma";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipes[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      const data = await getRandomRecipes(3);
      setRecipes(data);
    }
    fetchRecipes();
  }, []);

  const categories = ["Breakfast", "Lunch", "Dinner", "Desserts", "Drinks"];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Cookbook</h1>
        <p className="text-lg mb-6">
          Discover, share, and enjoy delicious recipes from around the world.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/recipes">
            <Button variant="secondary" size="lg" className="hover:cursor-pointer">
              Browse Recipes
            </Button>
          </Link>
          <Link href="/add-recipe">
            <Button variant="secondary" size="lg" className="hover:cursor-pointer">
              Add Your Recipe
            </Button>
          </Link>
        </div>
      </section>

      {/* random Recipes */}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Random Recipes
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Image
                src={recipe.image ?? "/no-image.jpg"}
                alt={recipe.name}
                width={400}
                height={300}
                className="object-cover w-full h-48"
              />
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/recipe/${recipe.slug}`}>View Recipe</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6 text-center">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl mx-auto">
          {categories.map((category) => (
            <Card
              key={category}
              className="p-6 text-center hover:bg-gray-100 transition cursor-pointer"
            >
              <CardTitle>{category}</CardTitle>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
