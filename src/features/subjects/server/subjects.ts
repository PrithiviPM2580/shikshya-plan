import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";

const subjectInput = z.object({
	name: z.string().trim().min(1).max(120),
	description: z.string().trim().max(500).optional(),
	color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const getSubjects = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await requireCurrentUser();

		return prisma.subject.findMany({
			where: { userId: user.id },
			include: {
				_count: { select: { tasks: true, exams: true } },
			},
			orderBy: { createdAt: "desc" },
		});
	},
);

export const createSubject = createServerFn({ method: "POST" })
	.validator(subjectInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();

		return prisma.subject.create({
			data: { ...data, userId: user.id },
		});
	});

export const deleteSubject = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string().uuid() }))
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();

		return prisma.subject.deleteMany({
			where: { id: data.id, userId: user.id },
		});
	});
