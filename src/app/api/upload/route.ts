import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const files = formData.getAll("files") as File[]

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads")
  const savedFiles: string[] = []

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filePath = path.join(uploadDir, file.name)
    await writeFile(filePath, buffer)

    savedFiles.push(`/uploads/${file.name}`)
  }

  return NextResponse.json({ files: savedFiles })
}
