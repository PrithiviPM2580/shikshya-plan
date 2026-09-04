import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import {
	sessionIdSchema,
	sessionInput,
	updateSessionInput,
} from "../validation";

const sessionInclude = {
	subject: { select: { id: true, name: true, color: true } },
} as const;

export const getSessions = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await requireCurrentUser();
		return prisma.studySession.findMany({
			where: { userId: user.id },
			include: sessionInclude,
			orderBy: { scheduledDate: "desc" },
		});
	},
);

async function validateRelations(
	userId: string,
	subjectId: string | null,
	planId: string | null,
) {
	if (subjectId) {
		const subject = await prisma.subject.findFirst({
			where: { id: subjectId, userId },
		});
		if (!subject) throw new Error("Subject not found");
	}
	if (planId) {
		const plan = await prisma.studyPlan.findFirst({
			where: { id: planId, userId },
		});
		if (!plan) throw new Error("Study plan not found");
	}
}

export const createSession = createServerFn({ method: "POST" })
	.validator(sessionInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		await validateRelations(user.id, data.subjectId, data.planId);
		return prisma.studySession.create({
			data: { ...data, userId: user.id },
			include: sessionInclude,
		});
	});

export const updateSession = createServerFn({ method: "POST" })
	.validator(updateSessionInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const { id, ...session } = data;
		await validateRelations(user.id, session.subjectId, session.planId);
		return prisma.studySession.updateMany({
			where: { id, userId: user.id },
			data: session,
		});
	});

export const completeSession = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string().uuid(),
			minutes: z.number().int().min(1).max(720),
		}),
	)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.$transaction(async (tx) => {
			const session = await tx.studySession.findFirst({
				where: { id: data.id, userId: user.id },
			});
			if (!session) throw new Error("Study session not found");
			await tx.studySession.update({
				where: { id: session.id },
				data: { completed: true },
			});
			return tx.studyLog.create({
				data: {
					userId: user.id,
					sessionId: session.id,
					subjectId: session.subjectId,
					minutes: data.minutes,
				},
			});
		});
	});

export const deleteSession = createServerFn({ method: "POST" })
	.validator(sessionIdSchema)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.studySession.deleteMany({
			where: { id: data.id, userId: user.id },
		});
	});
