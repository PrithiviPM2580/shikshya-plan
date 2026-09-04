import { createServerFn } from "@tanstack/react-start";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";

export const getExamOptions = createServerFn({ method: "GET" }).handler(async () => {
	const user = await requireCurrentUser();
	return prisma.subject.findMany({
		where: { userId: user.id },
		select: { id: true, name: true },
		orderBy: { name: "asc" },
	});
});