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

	return (
		<div>
			
		</div>
	);
}
