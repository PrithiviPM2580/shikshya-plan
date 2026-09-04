import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { examIdSchema, examInput, updateExamInput } from "../validation";

const examInclude = {
	subject: { select: { id: true, name: true, color: true } },
} as const;

export const getExams = createServerFn({ method: "GET" }).handler(async () => {
	const user = await requireCurrentUser();
	return prisma.exam.findMany({
		where: { userId: user.id },
		include: examInclude,
		orderBy: [{ completed: "asc" }, { examDate: "asc" }],
	});
});

async function validateSubject(userId: string, subjectId: string | null) {
	if (!subjectId) return;
	const subject = await prisma.subject.findFirst({
		where: { id: subjectId, userId },
	});
	if (!subject) throw new Error("Subject not found");
}

export const createExam = createServerFn({ method: "POST" })
	.validator(examInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		await validateSubject(user.id, data.subjectId);
		return prisma.exam.create({
			data: { ...data, userId: user.id },
			include: examInclude,
		});
	});

export const updateExam = createServerFn({ method: "POST" })
	.validator(updateExamInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const { id, ...exam } = data;
		await validateSubject(user.id, exam.subjectId);
		return prisma.exam.updateMany({
			where: { id, userId: user.id },
			data: exam,
		});
	});

export const toggleExam = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string().uuid(), completed: z.boolean() }))
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.exam.updateMany({
			where: { id: data.id, userId: user.id },
			data: { completed: data.completed },
		});
	});

export const deleteExam = createServerFn({ method: "POST" })
	.validator(examIdSchema)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.exam.deleteMany({ where: { id: data.id, userId: user.id } });
	});
