"use client";

import { useEffect, useState } from "react";
import { Gallery, Recipes } from "../../../../generated/prisma";
import {
	createGallery,
	deleteGallery,
	getGallery,
	updateGallery,
} from "@/app/_action/gallery-action";
import { uploadFile } from "@/utils/uploadFile";
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
import { getRecipes } from "@/app/_action/recipes-action";

export default function GalleryStudio() {
	const [gallery, setGallery] = useState<Gallery[]>([]);
	const [recipes, setRecipes] = useState<Recipes[]>([]);
	const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(
		null
	);
	const [imageFile, setImageFile] = useState<File | null>(null);
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
				const galleryData = await getGallery();
				const recipesData = await getRecipes();
				setGallery(galleryData);
				setRecipes(recipesData);
			} catch (error) {
				console.error("Failed to fetch gallery:", error);
			}
		};
		fetchData();
	}, []);

	const resetForm = () => {
		setSelectedGallery(null);
		setImageFile(null);
		setRecipeId(null);
	};

	const handleAddOpen = () => {
		resetForm();
		setOpenAdd(true);
	};

	const handleAddGallery = async () => {
		if (!imageFile || recipeId === null) return;

		const formData = new FormData();
		formData.append("file", imageFile);
		const data = await uploadFile(formData);

		await createGallery({
			id: 0,
			image: data.filePath,
			recipeId,
			createdAt: new Date(),
		});
		setGallery(await getGallery());
		setOpenAdd(false);
	};

	const handleEditOpen = (item: Gallery) => {
		setSelectedGallery(item);
		setRecipeId(item.recipeId);
		setOpenEdit(true);
	};

	const handleEditGallery = async () => {
		if (!selectedGallery || recipeId === null) return;

		let imagePath = selectedGallery.image;
		if (imageFile) {
			const formData = new FormData();
			formData.append("file", imageFile);
			const data = await uploadFile(formData);
			imagePath = data.filePath;
		}

		await updateGallery(selectedGallery.id, {
			id: selectedGallery.id,
			image: imagePath,
			recipeId,
			createdAt: new Date(),
		});
		setGallery(await getGallery());
		setOpenEdit(false);
	};

	const handleDeleteOpen = (item: Gallery) => {
		setSelectedGallery(item);
		setOpenConfirm(true);
	};

	const handleDeleteGallery = async () => {
		if (selectedGallery) {
			await deleteGallery(selectedGallery.id);
			setGallery(await getGallery());
		}
		setOpenConfirm(false);
	};

	const filteredGallery = gallery.filter((g) => {
		const recipeName = recipes.find((r) => r.id === g.recipeId)?.name ?? "";
		return recipeName.toLowerCase().includes(search.toLowerCase());
	});
	const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);
	const paginatedGallery = filteredGallery.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="px-7">
			<Card className="shadow-xl rounded-2xl">
				<CardHeader className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
					<CardTitle className="text-2xl mb-2 md:mb-0">
						Gallery
					</CardTitle>
					<div className="flex gap-2 flex-col md:flex-row items-start md:items-center">
						<Input
							placeholder="Search by recipe..."
							value={search ?? ""}
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
									Add Gallery
								</Button>
							</DialogTrigger>
							<DialogContent  aria-describedby="">
								<DialogHeader>
									<DialogTitle>Add New Gallery</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
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
											{recipes.map((r) => (
												<SelectItem
													key={r.id}
													value={r.id.toString()}
												>
													{r.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
										onClick={handleAddGallery}
										disabled={!imageFile || !recipeId}
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
								<TableHead>Image</TableHead>
								<TableHead>Recipe</TableHead>
								<TableHead className="text-right w-40">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedGallery.map((item) => (
								<TableRow key={item.id} className="h-20">
									<TableCell>{item.id}</TableCell>
									<TableCell>
										<img
											src={item.image}
											alt={`Gallery ${item.id}`}
											className="w-15 h-15 object-cover rounded-md"
										/>
									</TableCell>
									<TableCell>
										{recipes.find(
											(r) => r.id === item.recipeId
										)?.name ?? "N/A"}
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Dialog
											open={
												openEdit &&
												selectedGallery?.id === item.id
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
														Edit Gallery
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-4">
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
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{recipes.map(
																(r) => (
																	<SelectItem
																		key={
																			r.id
																		}
																		value={r.id.toString()}
																	>
																		{r.name}
																	</SelectItem>
																)
															)}
														</SelectContent>
													</Select>
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
															handleEditGallery
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
												selectedGallery?.id === item.id
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
														delete this gallery?
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-4 text-center space-x-10">
													<Button
														className="w-full bg-red-700 hover:bg-red-800 text-white"
														onClick={
															handleDeleteGallery
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
