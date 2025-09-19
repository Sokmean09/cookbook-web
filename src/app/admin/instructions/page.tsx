"use client";

import { useEffect, useState } from "react";
import { Instructions, Recipes } from "../../../../generated/prisma";
import {
	getInstructions,
	createInstruction,
	updateInstruction,
	deleteInstruction,
} from "@/app/_action/instruction-action";
import { getRecipes } from "@/app/_action/recipes-action";
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

export default function InstructionsStudio() {
	const [instructions, setInstructions] = useState<Instructions[]>([]);
	const [recipes, setRecipes] = useState<Recipes[]>([]);
	const [selectedInstruction, setSelectedInstruction] =
		useState<Instructions | null>(null);
	const [step, setStep] = useState<number>(1);
	const [content, setContent] = useState("");
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
				const instructionsData = await getInstructions();
				const recipesData = await getRecipes();
				setInstructions(sortByStep(instructionsData));
				setRecipes(recipesData);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};
		fetchData();
	}, []);

	const sortByStep = (list: Instructions[]) =>
		[...list].sort((a, b) => a.step - b.step);

	const resetForm = () => {
		setSelectedInstruction(null);
		setStep(1);
		setContent("");
		setRecipeId(null);
	};

	const handleAddOpen = () => {
		resetForm();
		setOpenAdd(true);
	};

	const handleAddInstruction = async () => {
		if (!content.trim() || recipeId === null) return;
		await createInstruction({
			id: 0,
			step,
			content,
			recipeId,
			createdAt: new Date(),
		});
		setInstructions(sortByStep(await getInstructions()));
		setOpenAdd(false);
	};

	const handleEditOpen = (instruction: Instructions) => {
		setSelectedInstruction(instruction);
		setStep(instruction.step);
		setContent(instruction.content);
		setRecipeId(instruction.recipeId);
		setOpenEdit(true);
	};

	const handleEditInstruction = async () => {
		if (!selectedInstruction || recipeId === null) return;
		await updateInstruction(selectedInstruction.id, {
			id: selectedInstruction.id,
			step,
			content,
			recipeId,
			createdAt: new Date(),
		});
		setInstructions(sortByStep(await getInstructions()));
		setOpenEdit(false);
	};

	const handleDeleteOpen = (instruction: Instructions) => {
		setSelectedInstruction(instruction);
		setOpenConfirm(true);
	};

	const handleDeleteInstruction = async () => {
		if (selectedInstruction) {
			await deleteInstruction(selectedInstruction.id);
			setInstructions(sortByStep(await getInstructions()));
		}
		setOpenConfirm(false);
	};

	const filteredInstructions = instructions.filter((inst) =>
		inst.content.toLowerCase().includes(search.toLowerCase())
	);
	const totalPages = Math.ceil(filteredInstructions.length / itemsPerPage);
	const paginatedInstructions = filteredInstructions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="px-7">
			<Card className="shadow-xl rounded-2xl">
				<CardHeader className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
					<CardTitle className="text-2xl mb-2 md:mb-0">
						Instructions
					</CardTitle>
					<div className="flex gap-2 flex-col md:flex-row items-start md:items-center">
						<Input
							placeholder="Search by content..."
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
									Add Instruction
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Add New Instruction
									</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<label>Step</label>
									<Input
										type="number"
										min={1}
										value={step}
										onChange={(e) =>
											setStep(Number(e.target.value))
										}
									/>
									<label>Content</label>
									<Textarea
										value={content}
										onChange={(e) =>
											setContent(e.target.value)
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
										onClick={handleAddInstruction}
										disabled={!content || !recipeId}
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
								<TableHead className="w-20">Step</TableHead>
								<TableHead className="w-80">Content</TableHead>
								<TableHead className="w-40">Recipe</TableHead>
								<TableHead className="text-right w-40">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedInstructions.map((instruction) => (
								<TableRow key={instruction.id} className="h-20">
									<TableCell>{instruction.id}</TableCell>
									<TableCell>{instruction.step}</TableCell>
									<TableCell>{instruction.content}</TableCell>
									<TableCell>
										{recipes.find(
											(r) => r.id === instruction.recipeId
										)?.name ?? "N/A"}
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Dialog
											open={
												openEdit &&
												selectedInstruction?.id ===
													instruction.id
											}
											onOpenChange={setOpenEdit}
										>
											<DialogTrigger asChild>
												<Button
													className="bg-blue-700 hover:bg-blue-800 text-white"
													onClick={() =>
														handleEditOpen(
															instruction
														)
													}
												>
													Edit
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>
														Edit Instruction
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-4">
													<label>Step</label>
													<Input
														type="number"
														min={1}
														value={step}
														onChange={(e) =>
															setStep(
																Number(
																	e.target
																		.value
																)
															)
														}
													/>
													<label>Content</label>
													<Textarea
														value={content}
														onChange={(e) =>
															setContent(
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
															handleEditInstruction
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
												selectedInstruction?.id ===
													instruction.id
											}
											onOpenChange={setOpenConfirm}
										>
											<DialogTrigger asChild>
												<Button
													className="bg-red-700 hover:bg-red-800 text-white"
													onClick={() =>
														handleDeleteOpen(
															instruction
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
														delete this instruction?
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-4 text-center space-x-10">
													<Button
														className="w-full bg-red-700 hover:bg-red-800 text-white"
														onClick={
															handleDeleteInstruction
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
