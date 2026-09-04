import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await auth.api.getSession({
			headers: await getRequestHeaders(),
		});

		return session?.user ?? null;
	},
);

export const requireCurrentUser = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error("Unauthorized");
		}

		return user;
	},
);
