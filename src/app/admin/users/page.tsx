"use client";

import { useEffect, useState } from "react";
import { Users } from "../../../../generated/prisma";
import {
	createUser,
	deleteUser,
	getUsers,
	updateUser,
} from "@/app/_action/user-action";
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
import bcrypt from "bcryptjs";
import UserForm from "@/app/_components/admin/UserForm";

export default function UsersStudio() {
	const [users, setUsers] = useState<Users[]>([]);
	const [newUser, setNewUser] = useState<Users>({
		id: 0,
		name: "",
		email: "",
		role: "user",
		password: "",
		createdAt: new Date(),
	});

	const [editingUser, setEditingUser] = useState<Users | null>(null);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

	const [search, setSearch] = useState("");

	const [openAdd, setOpenAdd] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userData = await getUsers();
				setUsers(userData);
			} catch (error) {
				console.error("Failed to fetch users:", error);
			}
		};
		fetchData();
	}, []);

	const handleAddOpen = () => {
		setNewUser({
			id: 0,
			name: "",
			email: "",
			role: "user",
			password: "",
			createdAt: new Date(),
		});
		setOpenAdd(true);
	};

	const handleAddUser = async () => {
		if (!newUser.name.trim()) return;

		const hashedPassword = await bcrypt.hash(newUser.password, 10);
		const user: Users = {
			...newUser,
			password: hashedPassword,
			createdAt: new Date(),
		};

		await createUser(user);
		setUsers(await getUsers());
		setOpenAdd(false);
	};

	const handleEditOpen = (user: Users) => {
		setEditingUser({ ...user, password: "" });
		setOpenEdit(true);
	};

	const handleEditUser = async () => {
		if (!editingUser) return;

		const hashedPassword = await bcrypt.hash(editingUser.password, 10);
		const updated: Users = { ...editingUser, password: hashedPassword };

		await updateUser(editingUser.id, updated);
		setUsers(await getUsers());
		setOpenEdit(false);
		setEditingUser(null);
	};

	const handleDeleteOpen = (id: number) => {
		setSelectedUserId(id);
		setOpenConfirm(true);
	};

	const handleDeleteUser = async () => {
		if (selectedUserId) {
			await deleteUser(selectedUserId);
			setUsers(await getUsers());
		}
		setOpenConfirm(false);
		setSelectedUserId(null);
	};

	const filteredUsers = users.filter(
		(u) =>
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
	const paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="px-7">
			<Card className="shadow-xl rounded-2xl">
				<CardHeader className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
					<CardTitle className="text-2xl mb-2 md:mb-0">
						Users
					</CardTitle>
					<div className="flex gap-2 flex-col md:flex-row items-start md:items-center">
						<Input
						type="text"
							placeholder="Search by name or email..."
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
									Add User
								</Button>
							</DialogTrigger>
							<DialogContent aria-describedby="">
								<DialogHeader>
									<DialogTitle>Add New User</DialogTitle>
								</DialogHeader>
								<UserForm
									user={newUser}
									onChange={setNewUser}
									onSubmit={handleAddUser}
									submitLabel="Save"
									mode="add"
								/>
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
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Created At</TableHead>
								<TableHead className="text-right w-40">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedUsers.map((item) => (
								<TableRow key={item.id}>
									<TableCell>{item.id}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.email}</TableCell>
									<TableCell>{item.role}</TableCell>
									<TableCell>
										{new Date(
											item.createdAt
										).toLocaleDateString()}
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Dialog
											open={openEdit}
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
														Edit User
													</DialogTitle>
												</DialogHeader>
												{editingUser && (
													<UserForm
														user={editingUser}
														onChange={
															setEditingUser
														}
														onSubmit={
															handleEditUser
														}
														submitLabel="Update"
														mode="edit"
													/>
												)}
											</DialogContent>
										</Dialog>

										<Dialog
											open={openConfirm}
											onOpenChange={setOpenConfirm}
										>
											<DialogTrigger asChild>
												<Button
													className="bg-red-700 hover:bg-red-800 text-white"
													onClick={() =>
														handleDeleteOpen(
															item.id
														)
													}
												>
													Delete
												</Button>
											</DialogTrigger>
											<DialogContent aria-describedby="">
												<DialogHeader>
													<DialogTitle>
														Are you sure you want to
														delete this user?
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-4 text-center space-x-10">
													<Button
														className="w-full bg-red-700 hover:bg-red-800 text-white"
														onClick={
															handleDeleteUser
														}
													>
														Yes
													</Button>
													<Button
														className="mr-4 w-full"
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
