"use server";
import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData): Promise<{ filePath: string }> {
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);


    try {        
        const uploadDir = './public/uploads';
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = `${uploadDir}/${file.name}`;
        await fs.writeFile(filePath, buffer);
        revalidatePath('/admin');
        return { filePath: filePath.replace('./public', '') };
    } catch (error) {
        console.error("File upload failed:", error);
        throw new Error("File upload failed");
    }
}