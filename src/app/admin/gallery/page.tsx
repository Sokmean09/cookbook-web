"use client";

import { useEffect, useState } from "react";
import { Gallery } from "../../../../generated/prisma";
import { createGallery, deleteGallery, getGallery, updateGallery } from "@/app/_action/gallery-action";
import { uploadFile } from "@/utils/uploadFile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function GalleryStudio() {

    const [gallery, setGallery] = useState<Gallery[]>([]);

    useEffect(() => {
            const fetchRecipes = async () => {
                try {
                    const data = await getGallery();
                    setGallery(data);
                } catch (error) {
                    console.error("Failed to fetch gallery:", error);
                }
            };
    
            fetchRecipes();
        }, []);

	const [id, setId] = useState<number | null>(null);
	const [image, setImage] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [recipeId, setRecipeId] = useState<number | null>(null);

    const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);

	const [openConfirm, setOpenConfirm] = useState(false);


    const handleAddOpen = () => {
		setImageFile(null);
        setRecipeId(null)

		setOpenAdd(true);
	};

    const handleAddGallery = async () => {
        let imagePath = image;

        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);

            const data = await uploadFile(formData);
            imagePath = data.filePath;
            setImage(imagePath);
            console.log(data.filePath);
            
        }

        const gallery: Gallery = {
            id: 0, 
            image: imagePath,
            recipeId: recipeId!,
            createdAt: new Date(),
        };
        await createGallery(gallery);

        const data = await getGallery();
        setGallery(data);

        setOpenAdd(false);
    };

    const handleEditOpen = (gallery: Gallery) => {
        console.log(gallery.id)
        setId(gallery.id);
        setImageFile(null);
        setRecipeId(null);

        setOpenEdit(true);
    };

    const handleEditGallery = async () => {
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

        const gallery: Gallery = {
            id: 0, 
            image: imagePath,
            recipeId: recipeId!,
            createdAt: new Date(),
        };
        await updateGallery(id, gallery);

        const data = await getGallery();
        setGallery(data);

        setOpenEdit(false);
    };
    
    const handleDeleteOpen = () => {
            setOpenConfirm(true);
        }
    
    const handleDeleteGallery = async (id?: number) => {
        if (id) {
            deleteGallery(id);

            const data = await getGallery();
            setGallery(data);
        }

        setOpenConfirm(false);
    };

    return(
        <div className="px-7">
            <Card className="shadow-xl rounded-2xl">
                <CardHeader>
					<CardTitle className="text-2xl">Gallery</CardTitle>
				</CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-4">
                        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
							<DialogTrigger asChild>
								<Button className="bg-green-700 hover:bg-green-800" onClick={handleAddOpen}>Add Gallery</Button>
							</DialogTrigger>
							<DialogContent aria-describedby="">
								<DialogHeader>
									<DialogTitle>Add New Gallery</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<label>Recipe Id</label>
									<Input
                                        type="number"
                                        placeholder="Recipe Id"
                                        value={recipeId ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            setRecipeId(value === "" ? null : Number(value))
                                        }}
                                    />
									<label>Image</label>
									<Input
										type="file"
										accept="image/*"
										onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
									/>
									<Button onClick={handleAddGallery} disabled={!imageFile}>Save</Button>
								</div>
							</DialogContent>
						</Dialog>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Recipe Id</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gallery.map((gallery) => (
                                <TableRow key={gallery.id}>
                                    <TableCell>{gallery.id}</TableCell>
                                    <TableCell>{gallery.image}</TableCell>
                                    <TableCell>{gallery.recipeId}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
											<DialogTrigger asChild>
												<Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={() => handleEditOpen(gallery)}>
													Edit
												</Button>
											</DialogTrigger>
											<DialogContent aria-describedby="">
												<DialogHeader>
													<DialogTitle>Edit Recipe</DialogTitle>
												</DialogHeader>
												<div className="space-y-4">
													<label>Recipe Id</label>
                                                    <Input
                                                        type="number"
                                                        placeholder="Recipe Id"
                                                        value={recipeId ?? ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value
                                                            setRecipeId(value === "" ? null : Number(value))
                                                        }}
                                                    />
                                                    <label>Image</label>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                                                    />
													<Button onClick={handleEditGallery} disabled={!imageFile}>Update</Button>
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
													<DialogTitle>Are you sure you want to delete this gallery?</DialogTitle>
												</DialogHeader>
												<div className="space-y-4 text-center space-x-10">
													<Button className="w-full bg-red-700 hover:bg-red-800 text-white" onClick={() => handleDeleteGallery(gallery.id)}>Yes</Button>
													<Button className="mr-4 w-full" variant="outline" onClick={() => handleDeleteGallery()}>Cancel</Button>
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