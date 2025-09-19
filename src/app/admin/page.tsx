"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getRecipes } from "../_action/recipes-action";
import { getGallery } from "../_action/gallery-action";
import { getUsers } from "../_action/user-action";
import { getRecipeInfo } from "../_action/recipeInfo-action";
import { getIngredients } from "../_action/ingredient-action";
import { getInstructions } from "../_action/instruction-action";
import DashboardCard from "../_components/admin/DashboardCard";

export default function AdminDashboard() {
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalRecipes, setTotalRecipes] = useState(0);
	const [totalRecipeInfo, setTotalRecipeInfo] = useState(0);
	const [totalGallery, setTotalGallery] = useState(0);
	const [totalIngredients, setTotalIngredients] = useState(0);
	const [totalInstructions, setTotalInstructions] = useState(0);
	useEffect(() => {
		const fetchDb = async () => {
			try {
				const users = await getUsers();
				const recipes = await getRecipes();
				const recipeInfo = await getRecipeInfo();
				const gallery = await getGallery();
				const ingredients = await getIngredients();
				const instructions = await getInstructions();
				setTotalUsers(users.length);
				setTotalRecipes(recipes.length);
				setTotalRecipeInfo(recipeInfo.length);
				setTotalGallery(gallery.length);
				setTotalIngredients(ingredients.length);
				setTotalInstructions(instructions.length);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};

		fetchDb();
	}, []);

	return (
		<div className="px-7">
			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
				<DashboardCard title="Users" total={totalUsers} path="/admin/users" />
				<DashboardCard title="Recipes" total={totalRecipes} path="/admin/recipes" />
				<DashboardCard title="RecipeInfo" total={totalRecipeInfo} path="/admin/recipeinfo" />
				<DashboardCard title="Gallery" total={totalGallery} path="/admin/gallery" />
				<DashboardCard title="Ingredients" total={totalIngredients} path="/admin/ingredients" />
				<DashboardCard title="Instructions" total={totalInstructions} path="/admin/instructions" />
			</div>
		</div>
	);
}
