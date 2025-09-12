// use api/auth intead


// import { cookies } from "next/headers";
// import { decrypt } from "@/lib/session";
// import { getUserById } from "../_action/user-action";

// export async function getUser() {
//     const cookie = (await cookies()).get("session")?.value;
//     const session = await decrypt(cookie);
//     const currentUser = await getUserById(Number(session?.userId));

//     const authToken = generateAuthToken();

//     return [200, { authToken, user: currentUser }] as const;
// }

// export async function login() {
//     const cookie = (await cookies()).get("session")?.value;
//     const session = await decrypt(cookie);
//     const currentUser = await getUserById(Number(session?.userId));

//     const authToken = generateAuthToken();

//     return [200, { authToken, user: currentUser }] as const;
// }

// function generateAuthToken() {
//     return Math.random().toString(36).substring(2);
// }