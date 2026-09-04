import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";
import prisma from "./prisma-client";

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

export const getOnboardingStatus = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await auth.api.getSession({
			headers: await getRequestHeaders(),
		});

		if (!session) {
			return { user: null, isComplete: false };
		}

		const profile = await prisma.profile.findUnique({
			where: { userId: session.user.id },
			select: { userId: true },
		});

		return { user: session.user, isComplete: profile !== null };
	},
);
