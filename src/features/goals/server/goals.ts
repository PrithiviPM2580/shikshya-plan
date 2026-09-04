import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { goalIdSchema, goalInput, updateGoalInput } from "../validation";

export const getGoals = createServerFn({ method: "GET" }).handler(async () => {
	const user = await requireCurrentUser();
	return prisma.goal.findMany({
		where: { userId: user.id },
		orderBy: [{ completed: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
	});
});

export const createGoal = createServerFn({ method: "POST" })
	.validator(goalInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.goal.create({
			data: {
				...data,
				userId: user.id,
				progress: Math.min(data.progress, data.target),
				completed: data.progress >= data.target,
			},
		});
	});

export const updateGoal = createServerFn({ method: "POST" })
	.validator(updateGoalInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const { id, ...goal } = data;
		const progress = Math.min(goal.progress, goal.target);
		return prisma.goal.updateMany({
			where: { id, userId: user.id },
			data: { ...goal, progress, completed: progress >= goal.target },
		});
	});

export const setGoalProgress = createServerFn({ method: "POST" })
	.validator(
		z.object({ id: z.string().uuid(), progress: z.number().int().min(0) }),
	)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const goal = await prisma.goal.findFirst({
			where: { id: data.id, userId: user.id },
		});
		if (!goal) throw new Error("Goal not found");
		const progress = Math.min(data.progress, goal.target);
		return prisma.goal.update({
			where: { id: goal.id },
			data: { progress, completed: progress >= goal.target },
		});
	});

export const deleteGoal = createServerFn({ method: "POST" })
	.validator(goalIdSchema)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.goal.deleteMany({ where: { id: data.id, userId: user.id } });
	});
