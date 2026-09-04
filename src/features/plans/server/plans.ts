import { createServerFn } from "@tanstack/react-start";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import {
	planIdSchema,
	planInput,
	planStatusInput,
	updatePlanInput,
} from "../validation";

const planInclude = {
	subjects: {
		select: {
			subject: {
				select: {
					id: true,
					name: true,
					color: true,
					tasks: { select: { completed: true } },
				},
			},
		},
	},
} as const;

export const getPlans = createServerFn({ method: "GET" }).handler(async () => {
	const user = await requireCurrentUser();
	return prisma.studyPlan.findMany({
		where: { userId: user.id },
		include: planInclude,
		orderBy: { createdAt: "desc" },
	});
});

async function subjectLinks(userId: string, subjectIds: string[]) {
	const subjects = await prisma.subject.findMany({
		where: { userId, id: { in: subjectIds } },
		select: { id: true },
	});
	if (subjects.length !== new Set(subjectIds).size)
		throw new Error("One or more subjects were not found");
	return subjectIds.map((subjectId) => ({ subjectId, userId }));
}

export const createPlan = createServerFn({ method: "POST" })
	.validator(planInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const subjects = await subjectLinks(user.id, data.subjectIds);
		return prisma.studyPlan.create({
			data: {
				title: data.title,
				description: data.description,
				goal: data.goal,
				startDate: data.startDate,
				endDate: data.endDate,
				userId: user.id,
				subjects: { create: subjects },
			},
			include: planInclude,
		});
	});

export const updatePlan = createServerFn({ method: "POST" })
	.validator(updatePlanInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const { id, subjectIds, ...plan } = data;
		const subjects = await subjectLinks(user.id, subjectIds);
		return prisma.$transaction(async (tx) => {
			const existing = await tx.studyPlan.findFirst({
				where: { id, userId: user.id },
			});
			if (!existing) throw new Error("Study plan not found");
			await tx.planSubject.deleteMany({ where: { planId: id } });
			return tx.studyPlan.update({
				where: { id },
				data: { ...plan, subjects: { create: subjects } },
				include: planInclude,
			});
		});
	});

export const updatePlanStatus = createServerFn({ method: "POST" })
	.validator(planStatusInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.studyPlan.updateMany({
			where: { id: data.id, userId: user.id },
			data: { status: data.status },
		});
	});

export const deletePlan = createServerFn({ method: "POST" })
	.validator(planIdSchema)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.studyPlan.deleteMany({
			where: { id: data.id, userId: user.id },
		});
	});
