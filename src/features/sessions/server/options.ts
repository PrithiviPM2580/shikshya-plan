import { createServerFn } from "@tanstack/react-start";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";

export const getSessionOptions = createServerFn({ method: "GET" }).handler(async () => {
	const user = await requireCurrentUser();
	const [subjects, plans] = await Promise.all([
		prisma.subject.findMany({ where: { userId: user.id }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
		prisma.studyPlan.findMany({ where: { userId: user.id, status: "ACTIVE" }, select: { id: true, title: true }, orderBy: { createdAt: "desc" } }),
	]);
	return { subjects, plans };
});