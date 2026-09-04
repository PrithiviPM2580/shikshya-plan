import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { taskIdSchema, taskInput, updateTaskInput } from "../validation";

export const getTasks = createServerFn({ method: "GET" }).handler(async () => {
	const user = await requireCurrentUser();

	return prisma.task.findMany({
		where: { userId: user.id },
		include: { subject: { select: { id: true, name: true, color: true } } },
		orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
	});
});

export const createTask = createServerFn({ method: "POST" })
	.validator(taskInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		if (data.subjectId) {
			const subject = await prisma.subject.findFirst({
				where: { id: data.subjectId, userId: user.id },
			});
			if (!subject) throw new Error("Subject not found");
		}

		return prisma.task.create({ data: { ...data, userId: user.id } });
	});

export const updateTask = createServerFn({ method: "POST" })
	.validator(updateTaskInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const { id, ...task } = data;

		return prisma.task.updateMany({
			where: { id, userId: user.id },
			data: task,
		});
	});

export const toggleTask = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string().uuid(), completed: z.boolean() }))
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.task.updateMany({
			where: { id: data.id, userId: user.id },
			data: { completed: data.completed },
		});
	});

export const deleteTask = createServerFn({ method: "POST" })
	.validator(taskIdSchema)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.task.deleteMany({ where: { id: data.id, userId: user.id } });
	});
