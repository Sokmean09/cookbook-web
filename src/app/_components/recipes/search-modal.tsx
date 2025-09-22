'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Recipes, Ingredients } from "../../../../generated/prisma";
import { getRecipes } from "../../_action/recipes-action";
import { getIngredients } from "../../_action/ingredient-action";
import Link from "next/link";

type SearchModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SearchModal({ open, setOpen }: SearchModalProps) {
  const [recipes, setRecipes] = useState<Recipes[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipes[]>([]);
  const [ingredients, setIngredients] = useState<Ingredients[]>([]);
  const [terms, setTerms] = useState("");

  // Fetch recipes and ingredients on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRecipes = await getRecipes();
        const allIngredients = await getIngredients();

        setRecipes(allRecipes);
        setFilteredRecipes(allRecipes);
        setIngredients(allIngredients);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  function handleSearch(searchTerms: string) {
    setTerms(searchTerms);
    const lowerTerms = searchTerms.toLowerCase();

    // Filter recipes by name
    const filteredByName = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(lowerTerms)
    );

    // Filter ingredients by name
    const matchingIngredients = ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(lowerTerms)
    );

    // Get recipeIds from matching ingredients
    const recipeIdsFromIngredients = matchingIngredients.map(i => i.recipeId);

    // Filter recipes that match ingredient recipeIds
    const filteredByIngredients = recipes.filter(recipe =>
      recipeIdsFromIngredients.includes(recipe.id)
    );

    // Merge and remove duplicates
    const finalFiltered = [...filteredByName, ...filteredByIngredients].filter(
      (v, i, a) => a.findIndex(r => r.id === v.id) === i
    );

    setFilteredRecipes(finalFiltered);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg" aria-describedby="">
        <DialogHeader>
          <DialogTitle>Search Recipes</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Search for a recipe or ingredient..."
            className="border p-2 rounded-lg w-full"
            value={terms}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Display filtered recipes */}
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {filteredRecipes.length === 0 ? (
              <p className="text-gray-500">No recipes found</p>
            ) : (
              filteredRecipes.map(recipe => (
                <Link 
                key={recipe.id} 
                className="p-2 border rounded-lg"
                href={`/recipe/${recipe.slug}`}
                >
                  <h3 className="font-semibold">{recipe.name}</h3>
                  <p className="text-sm text-gray-500">
                    Ingredients:{" "}
                    {ingredients
                      .filter(i => i.recipeId === recipe.id)
                      .map(i => i.name)
                      .join(", ")}
                  </p>
                </Link>
              ))
            )}
          </div>

          <Button onClick={() => setOpen(false)} className="w-full mt-4 hover:cursor-pointer">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
