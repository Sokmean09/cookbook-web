"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Image from "next/image"
import { Plus, Trash } from "lucide-react"
import { createRecipe } from "@/app/_action/recipes-action"
import { Gallery, Ingredients, Instructions, RecipeInfo, Recipes } from "../../../../generated/prisma"
import { slugify } from "@/utils/slugify"
import { uploadFile } from "@/utils/uploadFile"
import { createRecipeInfo } from "@/app/_action/recipeInfo-action"
import { createIngredient } from "@/app/_action/ingredient-action"
import { createInstruction } from "@/app/_action/instruction-action"
import { createGallery } from "@/app/_action/gallery-action"

export default function AddRecipePage() {

    const [recipeId, setrecipeId] = useState<number | null>(null);
    const [recipeName, setRecipeName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [theme, setTheme] = useState("");

    const [prepTime, setPrepTime] = useState<number | null>(null);
    const [cookTime, setCookTime] = useState<number | null>(null);
    const [servings, setServings] = useState<number | null>(null);

    const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
    const [instructions, setInstructions] = useState([{ step: 1, content: "" }]);

    const [gallery, setGallery] = useState([""]);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    const isFormEmpty = !recipeName || !description || (!image && !imageFile);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    const validateRecipe = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!recipeName.trim()) newErrors.recipeName = "Recipe name is required.";
        if (!description.trim()) newErrors.description = "Description is required.";
        if (!image && !imageFile) newErrors.image = "Recipe image is required.";
        if (!theme.trim()) newErrors.theme = "Theme is required.";
        if (prepTime === null || prepTime < 0) newErrors.prepTime = "Prep time must be non-negative.";
        if (cookTime === null || cookTime < 0) newErrors.cookTime = "Cook time must be non-negative.";
        if (servings === null || servings <= 0) newErrors.servings = "Servings must be greater than 0.";

        ingredients.forEach((ing, idx) => {
            if (!ing.name.trim()) newErrors[`ingredients-${idx}-name`] = "Name is required.";
            if (!ing.quantity.trim()) newErrors[`ingredients-${idx}-quantity`] = "Quantity is required.";
        });

        instructions.forEach((inst, idx) => {
            if (!inst.content.trim()) newErrors[`instructions-${idx}-content`] = "Step content is required.";
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSaveRecipe = async () => {
        if (!validateRecipe()) return;

        const id = await handleAddRecipe();
        if (!id) return;
        await handleAddRecipeInfo(id);
        await handleAddIngredient(id);
        await handleAddInstructions(id);
        await handleAddGallery(id);
        console.log("Added new recipe");
    }

    const handleAddRecipe = async () => {
        if (!recipeName.trim()) return;

        let imagePath = image;

        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);

            const data = await uploadFile(formData);
            imagePath = data.filePath;
            setImage(imagePath);
            console.log(data.filePath);
        }

        const recipe: Recipes = {
            id: 0,
            name: recipeName,
            slug: slugify(recipeName),
            description: description!,
            image: imagePath,
            theme: theme,
            createdAt: new Date(),
        };
        const result = await createRecipe(recipe);
        setrecipeId(result.id);
        return result.id;
    }

    const handleAddRecipeInfo = async (recipeId: number) => {
        if (!recipeId) return;

        const recipeInfo: RecipeInfo = {
            id: 0,
            recipeId: recipeId,
            prepTime: prepTime,
            cookTime: cookTime!,
            servings: servings,
            createdAt: new Date(),
        };
        await createRecipeInfo(recipeInfo);
    }

    const handleAddIngredient = async (recipeId: number) => {
        if (!recipeId) return;

        // Sequentially
        // for (const element of ingredients) {
        //     const ingredient: Ingredients = {
        //         id: 0,
        //         recipeId: recipeId,
        //         name: element.name,
        //         quantity: element.quantity,
        //         createdAt: new Date(),
        //     };
        //     await createIngredient(ingredient);
        // }

        // Parallel
        await Promise.all(ingredients.map(element => {
            const ingredient: Ingredients = {
                id: 0,
                recipeId: recipeId,
                name: element.name,
                quantity: element.quantity,
                createdAt: new Date(),
            };
            return createIngredient(ingredient);
        }));
    }

    const handleAddInstructions = async (recipeId: number) => {
        if (!recipeId) return;

        // Sequentially
        // for (const element of instructions) {
        //     const instruction: Instructions = {
        //         id: 0,
        //         recipeId: recipeId,
        //         step: element.step,
        //         content: element.content,
        //         createdAt: new Date(),
        //     };
        //     await createInstruction(instruction);
        // }

        // Parallel
        await Promise.all(instructions.map(element => {
            const instruction: Instructions = {
                id: 0,
                recipeId: recipeId,
                step: element.step,
                content: element.content,
                createdAt: new Date(),
            };
            return createInstruction(instruction);
        }));
    }

    const handleAddGallery = async (recipeId: number) => {
        if (!recipeId) return;

        // Sequentially
        // for (const element of galleryFiles) {
        //     const formData = new FormData();
        //     formData.append("file", element);
        //     const data = await uploadFile(formData);
        //     const gallery: Gallery = {
        //         id: 0,
        //         recipeId: recipeId,
        //         image: data.filePath,
        //         createdAt: new Date(),
        //     };
        //     await createGallery(gallery);
        // }

        // Parallel
        await Promise.all(
            galleryFiles.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const data = await uploadFile(formData);

                const galleryItem: Gallery = {
                    id: 0,
                    recipeId: recipeId,
                    image: data.filePath,
                    createdAt: new Date(),
                };

                await createGallery(galleryItem);
            })
        );

        setGalleryFiles([]);
        setGallery([]);
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const selectedFiles = Array.from(e.target.files)

        // Preview URLs
        const previews = selectedFiles.map((file) => URL.createObjectURL(file))

        setGalleryFiles((prev) => [...prev, ...selectedFiles]) // upload
        setGallery((prev) => [...prev, ...previews]) // preview
    }

    const removeImage = (index: number) => {
        setGallery((prev) => {
            const toRemove = prev[index]
            if (toRemove) {
                URL.revokeObjectURL(toRemove) //free memory
            }
            return prev.filter((_, i) => i !== index)
        })
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-12 bg-gray-200">
            <h1 className="text-3xl font-bold mb-8 text-center">Add New Recipe</h1>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid grid-cols-5 w-full bg-gray-300">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="info">Recipe Info</TabsTrigger>
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>

                {/* General Info */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Recipe Name" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />
                            {errors.recipeName && (
                                <p className="text-red-500 text-sm mt-1">{errors.recipeName}</p>
                            )}
                            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                            )}
                            <Input placeholder="Theme" value={theme} onChange={(e) => setTheme(e.target.value)} />
                            {errors.theme && (
                                <p className="text-red-500 text-sm mt-1">{errors.theme}</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Recipe Info */}
                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recipe Info</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-4">
                            <div>
                                <Input type="number" placeholder="Prep Time (minutes)" value={prepTime ?? ""} min={0}
                                    onChange={(e) => {
                                        let val = Number(e.target.value)
                                        setPrepTime(val)
                                    }} />
                                {errors.prepTime && (
                                    <p className="text-red-500 text-sm mt-1">{errors.prepTime}</p>
                                )}
                            </div>

                            <div>
                                <Input type="number" placeholder="Cook Time (minutes)" value={cookTime ?? ""} min={0}
                                    onChange={(e) => {
                                        let val = Number(e.target.value)
                                        setCookTime(val)
                                    }} />
                                {errors.cookTime && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cookTime}</p>
                                )}
                            </div>

                            <div>
                                <Input type="number" placeholder="Servings" value={servings ?? ""} min={0} max={1000}
                                    onChange={(e) => {
                                        let val = Number(e.target.value)
                                        if (val < 0) val = 0
                                        if (val > 1000) val = 1000
                                        setServings(val)
                                    }} />
                                {errors.servings && (
                                    <p className="text-red-500 text-sm mt-1">{errors.servings}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Ingredients */}
                <TabsContent value="ingredients">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ingredients</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ingredients.map((ing, i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="w-full">
                                        <Input
                                            placeholder="Name"
                                            value={ing.name}
                                            onChange={(e) => {
                                                const newIngs = [...ingredients]
                                                newIngs[i].name = e.target.value
                                                setIngredients(newIngs)
                                            }}
                                            className={errors[`ingredients-${i}-name`] ? "border-red-500" : ""}
                                        />
                                        {errors[`ingredients-${i}-name`] && (
                                            <p className="text-red-500 text-sm mt-1">{errors[`ingredients-${i}-name`]}</p>
                                        )}
                                    </div>
                                    <div className="w-full">
                                        <Input
                                        placeholder="Quantity"
                                        value={ing.quantity}
                                        onChange={(e) => {
                                            const newIngs = [...ingredients]
                                            newIngs[i].quantity = e.target.value
                                            setIngredients(newIngs)
                                        }}
                                        className={errors[`ingredients-${i}-quantity`] ? "border-red-500" : ""}
                                    />
                                    {errors[`ingredients-${i}-quantity`] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[`ingredients-${i}-quantity`]}</p>
                                    )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIngredients([...ingredients, { name: "", quantity: "" }])}
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Instructions */}
                <TabsContent value="instructions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {instructions.map((inst, i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="w-full">
                                        <Textarea
                                        placeholder={`Step ${i + 1}`}
                                        value={inst.content}
                                        onChange={(e) => {
                                            const newInst = [...instructions]
                                            newInst[i].content = e.target.value
                                            setInstructions(newInst)
                                        }}
                                        className={errors[`instructions-${i}-content`] ? "border-red-500" : ""}
                                    />
                                    {errors[`instructions-${i}-content`] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[`instructions-${i}-content`]}</p>
                                    )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                            setInstructions(instructions.filter((_, idx) => idx !== i))
                                        }
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setInstructions([...instructions, { step: instructions.length + 1, content: "" }])
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" /> Add Step
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* gallery */}
                <TabsContent value="gallery">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gallery</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* File Input */}
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />

                            {/* Preview */}
                            {gallery.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {gallery
                                        .filter((img) => img && img.trim() !== "")
                                        .map((img, i) => (
                                            <div key={i} className="relative group">
                                                <Image
                                                    src={img || "/no-image.jpg"}
                                                    alt={`Preview ${i}`}
                                                    width={300}
                                                    height={200}
                                                    className="object-cover w-full h-40 rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                                                    onClick={() => removeImage(i)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end">
                <Button size="lg" className="hover:cursor-pointer" onClick={handleSaveRecipe} disabled={isFormEmpty}>Save Recipe</Button>
            </div>
        </div>
    )
}
