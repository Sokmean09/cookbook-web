"use client";

import { useEffect, useState } from "react";
import { Ingredients, Recipes } from "../../../../generated/prisma";
import {
	getIngredients,
	createIngredient,
	updateIngredient,
	deleteIngredient,
} from "@/app/_action/ingredient-action";
import { getRecipes } from "@/app/_action/recipes-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function IngredientsStudio() {
	const [ingredients, setIngredients] = useState<Ingredients[]>([]);
	const [recipes, setRecipes] = useState<Recipes[]>([]);

	const [selectedIngredient, setSelectedIngredient] =
		useState<Ingredients | null>(null);
	const [name, setName] = useState("");
	const [quantity, setQuantity] = useState("");
	const [recipeId, setRecipeId] = useState<number | null>(null);

	const [search, setSearch] = useState("");

	const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const ingredientsData = await getIngredients();
				const recipesData = await getRecipes();
				setIngredients(ingredientsData);
				setRecipes(recipesData);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};
		fetchData();
	}, []);

	const resetForm = () => {
		setSelectedIngredient(null);
		setName("");
		setQuantity("");
		setRecipeId(null);
	};

	const handleAddOpen = () => {
		resetForm();
		setOpenAdd(true);
	};

	const handleAddIngredient = async () => {
		if (!name.trim() || recipeId === null) return;

		const ingredient: Ingredients = {
			id: 0,
			name,
			quantity,
			recipeId,
			createdAt: new Date(),
		};

		await createIngredient(ingredient);
		setIngredients(await getIngredients());
		setOpenAdd(false);
	};

	const handleEditOpen = (ingredient: Ingredients) => {
		setSelectedIngredient(ingredient);
		setName(ingredient.name);
		setQuantity(ingredient.quantity ?? "");
		setRecipeId(ingredient.recipeId);
		setOpenEdit(true);
	};

	const handleEditIngredient = async () => {
		if (!selectedIngredient || recipeId === null) return;

		const updatedIngredient: Ingredients = {
			id: selectedIngredient.id,
			name,
			quantity,
			recipeId,
			createdAt: new Date(),
		};

		await updateIngredient(selectedIngredient.id, updatedIngredient);
		setIngredients(await getIngredients());
		setOpenEdit(false);
	};

	const handleDeleteOpen = (ingredient: Ingredients) => {
		setSelectedIngredient(ingredient);
		setOpenConfirm(true);
	};

	const handleDeleteIngredient = async () => {
		if (selectedIngredient) {
			await deleteIngredient(selectedIngredient.id);
			setIngredients(await getIngredients());
		}
		setOpenConfirm(false);
	};

	const filteredIngredients = ingredients.filter((ing) =>
		ing.name.toLowerCase().includes(search.toLowerCase())
	);
	const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
	const paginatedIngredients = filteredIngredients.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="px-7">
			<Card className="shadow-xl rounded-2xl">
				<CardHeader className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
					<CardTitle className="text-2xl mb-2 md:mb-0">
						Ingredients
					</CardTitle>
					<div className="flex gap-2 flex-col md:flex-row items-start md:items-center">
						<Input
							placeholder="Search by name..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setCurrentPage(1);
							}}
							className="w-full md:w-auto"
						/>
						<Dialog open={openAdd} onOpenChange={setOpenAdd}>
							<DialogTrigger asChild>
								<Button
									className="bg-green-700 hover:bg-green-800"
									onClick={handleAddOpen}
								>
									Add Ingredient
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Add New Ingredient
									</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<label>Name</label>
									<Input
										placeholder="Name"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
									/>
									<label>Quantity</label>
									<Input
										placeholder="Quantity"
										value={quantity}
										onChange={(e) =>
											setQuantity(e.target.value)
										}
									/>
									<label>Recipe</label>
									<Select
										value={recipeId?.toString() ?? ""}
										onValueChange={(val) =>
											setRecipeId(Number(val))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select Recipe" />
										</SelectTrigger>
										<SelectContent>
											{recipes.map((recipe) => (
												<SelectItem
													key={recipe.id}
													value={recipe.id.toString()}
												>
													{recipe.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										onClick={handleAddIngredient}
										disabled={!name || !recipeId}
									>
										Save
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>

				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead className="w-40">Name</TableHead>
								<TableHead className="w-32">Quantity</TableHead>
								<TableHead className="w-40">Recipe</TableHead>
								<TableHead className="text-right w-40">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedIngredients.map((ingredient) => (
								<TableRow key={ingredient.id} className="h-20">
									<TableCell>{ingredient.id}</TableCell>
									<TableCell>{ingredient.name}</TableCell>
									<TableCell>{ingredient.quantity}</TableCell>
									<TableCell>
										{recipes.find(
											(r) => r.id === ingredient.recipeId
										)?.name ?? "N/A"}
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Dialog
											open={
												openEdit &&
												selectedIngredient?.id ===
													ingredient.id
											}
											onOpenChange={setOpenEdit}
										>
											<DialogTrigger asChild>
												<Button
													className="bg-blue-700 hover:bg-blue-800 text-white"
													onClick={() =>
														handleEditOpen(
															ingredient
														)
													}
												>
													Edit
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>
														Edit Ingredient
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-4">
													<label>Name</label>
													<Input
														value={name}
														onChange={(e) =>
															setName(
																e.target.value
															)
														}
													/>
													<label>Quantity</label>
													<Input
														value={quantity}
														onChange={(e) =>
															setQuantity(
																e.target.value
															)
														}
													/>
													<label>Recipe</label>
													<Select
														value={
															recipeId?.toString() ??
															""
														}
														onValueChange={(val) =>
															setRecipeId(
																Number(val)
															)
														}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select Recipe" />
														</SelectTrigger>
														<SelectContent>
															{recipes.map(
																(recipe) => (
																	<SelectItem
																		key={
																			recipe.id
																		}
																		value={recipe.id.toString()}
																	>
																		{
																			recipe.name
																		}
																	</SelectItem>
																)
															)}
														</SelectContent>
													</Select>
													<Button
														onClick={
															handleEditIngredient
														}
													>
														Update
													</Button>
												</div>
											</DialogContent>
										</Dialog>

										<Dialog
											open={
												openConfirm &&
												selectedIngredient?.id ===
													ingredient.id
											}
											onOpenChange={setOpenConfirm}
										>
											<DialogTrigger asChild>
												<Button
													className="bg-red-700 hover:bg-red-800 text-white"
													onClick={() =>
														handleDeleteOpen(
															ingredient
														)
													}
												>
													Delete
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>
														Are you sure you want to
														delete this ingredient?
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-4 text-center space-x-10">
													<Button
														className="w-full bg-red-700 hover:bg-red-800 text-white"
														onClick={
															handleDeleteIngredient
														}
													>
														Yes
													</Button>
													<Button
														className="w-full"
														variant="outline"
														onClick={() =>
															setOpenConfirm(
																false
															)
														}
													>
														Cancel
													</Button>
												</div>
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{/* Pagination */}
					<div className="flex justify-between items-center mt-4">
						<div className="flex items-center gap-2">
							<span>Items per page:</span>
							<Select
								value={itemsPerPage.toString()}
								onValueChange={(val) => {
									setItemsPerPage(Number(val));
									setCurrentPage(1);
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{[5, 10, 20, 50].map((n) => (
										<SelectItem
											key={n}
											value={n.toString()}
										>
											{n}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center gap-2">
							<Button
								onClick={() =>
									setCurrentPage((p) => Math.max(1, p - 1))
								}
								disabled={currentPage === 1}
							>
								Prev
							</Button>
							<span>
								Page {currentPage} of {totalPages}
							</span>
							<Button
								onClick={() =>
									setCurrentPage((p) =>
										Math.min(totalPages, p + 1)
									)
								}
								disabled={currentPage === totalPages}
							>
								Next
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
