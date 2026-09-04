import { createServerFn } from "@tanstack/react-start";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import {
	subjectIdSchema,
	subjectInput,
	updateSubjectInput,
} from "../validation";

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

export const updateSubject = createServerFn({ method: "POST" })
	.validator(updateSubjectInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const { id, ...subject } = data;

		return prisma.subject.updateMany({
			where: { id, userId: user.id },
			data: subject,
		});
	});

export const deleteSubject = createServerFn({ method: "POST" })
	.validator(subjectIdSchema)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();

		return prisma.subject.deleteMany({
			where: { id: data.id, userId: user.id },
		});
	});
