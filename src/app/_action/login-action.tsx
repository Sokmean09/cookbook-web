// migrated to /_component/AuthProvider


// "use server";

// import { z } from "zod";
// import { redirect } from "next/navigation";
// import { createSession, deleteSession } from "@/lib/session";
// import { getUserByEmail } from "./user-action";

// const loginSchema = z.object({
//   email: z.email({ message: "Invalid email address" }).trim(),
//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters" })
//     .trim(),
// });

// export async function login(prevState: any, formData: FormData) {
//   const result = loginSchema.safeParse(Object.fromEntries(formData));

//   if (!result.success) {
//     return {
//       errors: result.error.flatten().fieldErrors,
//     };
//   }

//   const { email, password } = result.data;

//   const UserFound = await getUserByEmail(email);
//   if (!UserFound) {
//     return {
//       errors: {
//         email: ["Invalid email or password"],
//       },
//     };
//   }

//   if (email !== UserFound.email || password !== UserFound.password) {
//     return {
//       errors: {
//         email: ["Invalid email or password"],
//       },
//     };
//   }

//   await createSession(String(UserFound.id));

//   redirect("/");
// }

// export async function logout() {
//   await deleteSession();
//   redirect("/login");
// }