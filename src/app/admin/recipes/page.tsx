"use client";

import { useEffect, useState } from "react";
import { Recipes } from "../../../../generated/prisma";
import {
	createRecipe,
	deleteRecipe,
	getRecipes,
	updateRecipe,
} from "@/app/_action/recipes-action";
import { uploadFile } from "@/utils/uploadFile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function RecipeStudio() {
	const [recipes, setRecipes] = useState<Recipes[]>([]);
	const [selectedRecipe, setSelectedRecipe] = useState<Recipes | null>(null);

	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");
	const [theme, setTheme] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);

	const [search, setSearch] = useState("");

	const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const recipeData = await getRecipes();
				setRecipes(recipeData);
			} catch (error) {
				console.error("Failed to fetch recipes:", error);
			}
		};
		fetchData();
	}, []);

	const resetForm = () => {
		setSelectedRecipe(null);
		setName("");
		setSlug("");
		setDescription("");
		setTheme("");
		setImageFile(null);
	};

	const handleAddOpen = () => {
		resetForm();
		setOpenAdd(true);
	};

	const handleAddRecipe = async () => {
		if (!name) return;

		let imagePath = "";
		if (imageFile) {
			const formData = new FormData();
			formData.append("file", imageFile);
			const data = await uploadFile(formData);
			imagePath = data.filePath;
		}

		await createRecipe({
			id: 0,
			name,
			slug,
			description,
			image: imagePath,
			theme,
			createdAt: new Date(),
		});

		setRecipes(await getRecipes());
		setOpenAdd(false);
	};

	const handleEditOpen = (item: Recipes) => {
		setSelectedRecipe(item);
		setName(item.name);
		setSlug(item.slug);
		setDescription(item.description ?? "");
		setTheme(item.theme ?? "");
		setImageFile(null);
		setOpenEdit(true);
	};

	const handleEditRecipe = async () => {
		if (!selectedRecipe) return;

		let imagePath = selectedRecipe.image ?? "";
		if (imageFile) {
			const formData = new FormData();
			formData.append("file", imageFile);
			const data = await uploadFile(formData);
			imagePath = data.filePath;
		}

		await updateRecipe(selectedRecipe.id, {
			id: selectedRecipe.id,
			name,
			slug,
			description,
			image: imagePath,
			theme,
			createdAt: new Date(),
		});

		setRecipes(await getRecipes());
		setOpenEdit(false);
	};

	const handleDeleteOpen = (item: Recipes) => {
		setSelectedRecipe(item);
		setOpenConfirm(true);
	};

	const handleDeleteRecipe = async () => {
		if (selectedRecipe) {
			await deleteRecipe(selectedRecipe.id);
			setRecipes(await getRecipes());
		}
		setOpenConfirm(false);
	};

	const filteredRecipes = recipes.filter((r) =>
		r.name.toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
	const paginatedRecipes = filteredRecipes.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="px-7">
			<Card className="shadow-xl rounded-2xl">
				<CardHeader className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
					<CardTitle className="text-2xl mb-2 md:mb-0">
						Recipes
					</CardTitle>
					<div className="flex gap-2 flex-col md:flex-row items-start md:items-center">
						<Input
							placeholder="Search recipes..."
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
									Add Recipe
								</Button>
							</DialogTrigger>
							<DialogContent  aria-describedby="">
								<DialogHeader>
									<DialogTitle>Add New Recipe</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<label>Name</label>
									<Input
										placeholder="Recipe name"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
									/>
									<label>Slug</label>
									<Input
										placeholder="Leave empty to be auto-generated"
										value={slug}
										onChange={(e) => {
											const val = e.target.value
												.toLowerCase()
												.replace(/[^a-z0-9-]/g, "");
											setSlug(val);
										}}
									/>
									<label>Description</label>
									<Textarea
										className="break-all"
										placeholder="Description"
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
									/>
									<label>Theme</label>
									<Input
										placeholder="Theme"
										value={theme}
										onChange={(e) =>
											setTheme(e.target.value)
										}
									/>
									<label>Image</label>
									<Input
										type="file"
										accept="image/*"
										onChange={(e) =>
											setImageFile(
												e.target.files?.[0] ?? null
											)
										}
									/>
									<Button
										onClick={handleAddRecipe}
										disabled={!name.trim() || !name}
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
								<TableHead>Name</TableHead>
								<TableHead>Slug</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Theme</TableHead>
								<TableHead>Image</TableHead>
								<TableHead className="text-right w-40">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedRecipes.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.slug}</TableCell>
									<TableCell>
										{item.description ?? "-"}
									</TableCell>
									<TableCell>{item.theme ?? "-"}</TableCell>
									<TableCell>
										{item.image ? (
											<img
												src={item.image}
												alt={item.name}
												className="w-16 h-16 object-cover rounded-md"
											/>
										) : (
											"N/A"
										)}
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Dialog
											open={
												openEdit &&
												selectedRecipe?.id === item.id
											}
											onOpenChange={setOpenEdit}
										>
											<DialogTrigger asChild>
												<Button
													className="bg-blue-700 hover:bg-blue-800 text-white"
													onClick={() =>
														handleEditOpen(item)
													}
												>
													Edit
												</Button>
											</DialogTrigger>
											<DialogContent aria-describedby="">
												<DialogHeader>
													<DialogTitle>
														Edit Recipe
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
													<label>Slug</label>
													<Input
														value={slug}
														onChange={(e) => {
															const val = e.target.value
																.toLowerCase()
																.replace(/[^a-z0-9-]/g, "");
															setSlug(val);
														}}
													/>
													<label>Description</label>
													<Textarea
														className="break-all"
														value={description}
														onChange={(e) =>
															setDescription(
																e.target.value
															)
														}
													/>
													<label>Theme</label>
													<Input
														value={theme}
														onChange={(e) =>
															setTheme(
																e.target.value
															)
														}
													/>
													<label>Image</label>
													<Input
														type="file"
														accept="image/*"
														onChange={(e) =>
															setImageFile(
																e.target
																	.files?.[0] ??
																null
															)
														}
													/>
													<Button
														onClick={
															handleEditRecipe
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
												selectedRecipe?.id === item.id
											}
											onOpenChange={setOpenConfirm}
										>
											<DialogTrigger asChild>
												<Button
													className="bg-red-700 hover:bg-red-800 text-white"
													onClick={() =>
														handleDeleteOpen(item)
													}
												>
													Delete
												</Button>
											</DialogTrigger>
											<DialogContent aria-describedby="">
												<DialogHeader>
													<DialogTitle>
														Are you sure you want to
														delete this recipe?
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-4 text-center space-x-10">
													<Button
														className="w-full bg-red-700 hover:bg-red-800 text-white"
														onClick={
															handleDeleteRecipe
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
