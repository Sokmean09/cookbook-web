import RecipesCardList from "@/app/_components/recipes/recipesCard";
import React from "react";

export default function Recipes() {
	return (
		<div>
			<div>Recipes</div>
      <div className="mx-6">
        <h1 className="font-medium text-4xl my-6">
          All Recipes
        </h1>
			  <RecipesCardList />
      </div>
		</div>
	);
}
