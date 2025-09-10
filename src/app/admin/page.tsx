"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Recipes } from "../../../generated/prisma";
import { createRecipe, deleteRecipe, getRecipes, updateRecipe } from "../_action/recipes-action";
import { Textarea } from "@/components/ui/textarea";
import { uploadFile } from "@/utils/uploadFile";

export default function AdminDashboard() {

	const [recipes, setRecipes] = useState<Recipes[]>([]);

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				const data = await getRecipes();
				setRecipes(data);
			} catch (error) {
				console.error("Failed to fetch recipes:", error);
			}
		};

		fetchRecipes();
	}, []);

	const [id, setId] = useState<number | null>(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [image, setImage] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [theme, setTheme] = useState("");

	const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);

	const [openConfirm, setOpenConfirm] = useState(false);


	const handleAddOpen = () => {
		setName("");
		setDescription("");
		// setImage("");
		setImageFile(null);
		setTheme("");

		setOpenAdd(true);
	};

	const handleAddRecipe = async () => {
		if (!name.trim()) return;

		let imagePath = image;

		if (imageFile) {
			const formData = new FormData();
			formData.append('file', imageFile);

			const data = await uploadFile(formData);
			imagePath = data.filePath;
			setImage(imagePath);
			console.log(data.filePath);
			
		}

		const recipe = [name, description, imagePath, theme];
		await createRecipe(recipe);

		const data = await getRecipes();
		setRecipes(data);

		setOpenAdd(false);
	};

	const handleEditOpen = (recipe: Recipes) => {
		setId(recipe.id);
		setName(recipe.name);
		setDescription(recipe.description ?? "");
		// setImage(recipe.image ?? "");
		setImageFile(null);
		setTheme(recipe.theme ?? "");

		setOpenEdit(true);
	};

	const handleEditRecipe = async () => {
		if (id === null) return;

		let imagePath = image;

		if (imageFile) {
			const formData = new FormData();
			formData.append('file', imageFile);

			const data = await uploadFile(formData);
			imagePath = data.filePath;
			setImage(imagePath);
			console.log(data.filePath);
			
		}
		const recipe = [name, description, imagePath, theme];
		await updateRecipe(id, recipe);

		const data = await getRecipes();
		setRecipes(data);

		setOpenEdit(false);
	};

	const handleDeleteOpen = () => {
		setOpenConfirm(true);
	}

	const handleDeleteRecipe = async (id?: number) => {
		if (id) {
			deleteRecipe(id);

			const data = await getRecipes();
			setRecipes(data);
		}

		setOpenConfirm(false);
	};

	return (
		<div className="px-7">
			<Card className="shadow-xl rounded-2xl">
				<CardHeader>
					<CardTitle className="text-2xl">Admin Dashboard</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex justify-between mb-4">
						<Dialog open={openAdd} onOpenChange={setOpenAdd}>
							<DialogTrigger asChild>
								<Button className="bg-green-700 hover:bg-green-800" onClick={handleAddOpen}>Add Recipe</Button>
							</DialogTrigger>
							<DialogContent aria-describedby="">
								<DialogHeader>
									<DialogTitle>Add New Recipe</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<label>Name</label>
									<Input
										placeholder="Recipe name"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
									<label>Description</label>
									<Textarea
										placeholder="Description"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									/>
									{/* <label>Image URL</label>
									<Input
										placeholder="Image URL"
										value={image}
										onChange={(e) => setImage(e.target.value)}
									/> */}
									<label>Image</label>
									<Input
										type="file"
										accept="image/*"
										onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
									/>
									<label>Theme</label>
									<Input
										placeholder="Theme"
										value={theme}
										onChange={(e) => setTheme(e.target.value)}
									/>
									<Button onClick={handleAddRecipe} disabled={!imageFile}>Save</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Image</TableHead>
								<TableHead>Theme</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recipes.map((recipe) => (
								<TableRow key={recipe.id}>
									<TableCell>{recipe.id}</TableCell>
									<TableCell>{recipe.name}</TableCell>
									<TableCell>{recipe.description}</TableCell>
									<TableCell>{recipe.image}</TableCell>
									<TableCell>{recipe.theme}</TableCell>
									<TableCell className="text-right space-x-2">
										<Dialog open={openEdit} onOpenChange={setOpenEdit}>
											<DialogTrigger asChild>
												<Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={() => handleEditOpen(recipe)}>
													Edit
												</Button>
											</DialogTrigger>
											<DialogContent aria-describedby="">
												<DialogHeader>
													<DialogTitle>Edit Recipe</DialogTitle>
												</DialogHeader>
												<div className="space-y-4">
													<label>Name</label>
													<Input
														placeholder="Recipe name"
														value={name}
														onChange={(e) => setName(e.target.value)}
													/>
													<label>Description</label>
													<Textarea
														placeholder="Description"
														value={description}
														onChange={(e) => setDescription(e.target.value)}
													/>
													{/* <label>Image URL</label>
													<Input
														placeholder="Image URL"
														value={image}
														onChange={(e) => setImage(e.target.value)}
													/> */}
													<label>Image</label>
													<Input
														type="file"
														accept="image/*"
														onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
													/>
													<label>Theme</label>
													<Input
														placeholder="Theme"
														value={theme}
														onChange={(e) => setTheme(e.target.value)}
													/>
													<Button onClick={handleEditRecipe} disabled={!imageFile}>Update</Button>
												</div>
											</DialogContent>
										</Dialog>
										<Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
											<DialogTrigger asChild>
												<Button
													className="bg-red-700 hover:bg-red-800 text-white"
													onClick={() => handleDeleteOpen()}
												>
													Delete
												</Button>
											</DialogTrigger>
											<DialogContent aria-describedby="">
												<DialogHeader>
													<DialogTitle>Are you sure you want to delete this recipe?</DialogTitle>
												</DialogHeader>
												<div className="space-y-4 text-center space-x-10">
													<Button className="w-full bg-red-700 hover:bg-red-800 text-white" onClick={() => handleDeleteRecipe(recipe.id)}>Yes</Button>
													<Button className="mr-4 w-full" variant="outline" onClick={() => handleDeleteRecipe()}>Cancel</Button>
												</div>
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
