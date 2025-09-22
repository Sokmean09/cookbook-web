"use client";

import { useEffect, useState } from "react";
import { RecipeInfo, Recipes } from "../../../../generated/prisma";
import {
	createRecipeInfo,
	deleteRecipeInfo,
	getRecipeInfo,
	updateRecipeInfo,
} from "@/app/_action/recipeInfo-action";
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

export default function RecipeInfoStudio() {
	const [recipeInfos, setRecipeInfos] = useState<RecipeInfo[]>([]);
	const [recipes, setRecipes] = useState<Recipes[]>([]);
	const [selectedInfo, setSelectedInfo] = useState<RecipeInfo | null>(null);

	const [prepTime, setPrepTime] = useState<number | null>(null);
	const [cookTime, setCookTime] = useState<number | null>(null);
	const [servings, setServings] = useState<number | null>(null);
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
				const infoData = await getRecipeInfo();
				const recipesData = await getRecipes();
				setRecipeInfos(infoData);
				setRecipes(recipesData);
			} catch (error) {
				console.error("Failed to fetch recipe info:", error);
			}
		};
		fetchData();
	}, []);

	const resetForm = () => {
		setSelectedInfo(null);
		setPrepTime(null);
		setCookTime(null);
		setServings(null);
		setRecipeId(null);
	};

	const handleAddOpen = () => {
		resetForm();
		setOpenAdd(true);
	};

	const handleAddInfo = async () => {
		if (recipeId === null) return;

		await createRecipeInfo({
			id: 0,
			prepTime: prepTime ?? 0,
			cookTime: cookTime ?? 0,
			servings: servings ?? 0,
			recipeId,
			createdAt: new Date(),
		});

		setRecipeInfos(await getRecipeInfo());
		setOpenAdd(false);
	};

	const handleEditOpen = (item: RecipeInfo) => {
		setSelectedInfo(item);
		setPrepTime(item.prepTime ?? null);
		setCookTime(item.cookTime ?? null);
		setServings(item.servings ?? null);
		setRecipeId(item.recipeId);
		setOpenEdit(true);
	};

	const handleEditInfo = async () => {
		if (!selectedInfo || recipeId === null) return;

		await updateRecipeInfo(selectedInfo.id, {
			id: selectedInfo.id,
			prepTime: prepTime ?? 0,
			cookTime: cookTime ?? 0,
			servings: servings ?? 0,
			recipeId,
			createdAt: new Date(),
		});

		setRecipeInfos(await getRecipeInfo());
		setOpenEdit(false);
	};

	const handleDeleteOpen = (item: RecipeInfo) => {
		setSelectedInfo(item);
		setOpenConfirm(true);
	};

	const handleDeleteInfo = async () => {
		if (selectedInfo) {
			await deleteRecipeInfo(selectedInfo.id);
			setRecipeInfos(await getRecipeInfo());
		}
		setOpenConfirm(false);
	};

	const filteredInfos = recipeInfos.filter((info) => {
		const recipeName =
			recipes.find((r) => r.id === info.recipeId)?.name ?? "";
		return recipeName.toLowerCase().includes(search.toLowerCase());
	});

	const totalPages = Math.ceil(filteredInfos.length / itemsPerPage);
	const paginatedInfos = filteredInfos.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="px-7">
			<Card className="shadow-xl rounded-2xl">
				<CardHeader className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
					<CardTitle className="text-2xl mb-2 md:mb-0">
						Recipe Info
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
									Add Info
								</Button>
							</DialogTrigger>
							<DialogContent aria-describedby="">
								<DialogHeader>
									<DialogTitle>
										Add New Recipe Info
									</DialogTitle>
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
									<label>Prep Time (mins)</label>
									<Input
										type="number"
										value={prepTime ?? ""}
										onChange={(e) =>
											setPrepTime(Number(e.target.value))
										}
									/>
									<label>Cook Time (mins)</label>
									<Input
										type="number"
										value={cookTime ?? ""}
										onChange={(e) =>
											setCookTime(Number(e.target.value))
										}
									/>
									<label>Servings</label>
									<Input
										type="number"
										value={servings ?? ""}
										onChange={(e) =>
											setServings(Number(e.target.value))
										}
									/>
									<Button
										onClick={handleAddInfo}
										disabled={!recipeId}
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
								<TableHead>Recipe</TableHead>
								<TableHead>Prep Time</TableHead>
								<TableHead>Cook Time</TableHead>
								<TableHead>Servings</TableHead>
								<TableHead className="text-right w-40">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedInfos.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.id}</TableCell>
									<TableCell>
										{recipes.find(
											(r) => r.id === item.recipeId
										)?.name ?? "N/A"}
									</TableCell>
									<TableCell>
										{item.prepTime ?? "-"}
									</TableCell>
									<TableCell>
										{item.cookTime ?? "-"}
									</TableCell>
									<TableCell>
										{item.servings ?? "-"}
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Dialog
											open={
												openEdit &&
												selectedInfo?.id === item.id
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
														Edit Recipe Info
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
													<label>
														Prep Time (mins)
													</label>
													<Input
														type="number"
														value={prepTime ?? ""}
														onChange={(e) =>
															setPrepTime(
																Number(
																	e.target
																		.value
																)
															)
														}
													/>
													<label>
														Cook Time (mins)
													</label>
													<Input
														type="number"
														value={cookTime ?? ""}
														onChange={(e) =>
															setCookTime(
																Number(
																	e.target
																		.value
																)
															)
														}
													/>
													<label>Servings</label>
													<Input
														type="number"
														value={servings ?? ""}
														onChange={(e) =>
															setServings(
																Number(
																	e.target
																		.value
																)
															)
														}
													/>
													<Button
														onClick={handleEditInfo}
													>
														Update
													</Button>
												</div>
											</DialogContent>
										</Dialog>

										<Dialog
											open={
												openConfirm &&
												selectedInfo?.id === item.id
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
														delete this info?
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-4 text-center space-x-10">
													<Button
														className="w-full bg-red-700 hover:bg-red-800 text-white"
														onClick={
															handleDeleteInfo
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
