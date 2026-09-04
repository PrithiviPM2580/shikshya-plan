import { createServerFn } from "@tanstack/react-start";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { pomodoroIdSchema, pomodoroInput } from "../validation";

const sessionInclude = {
	subject: { select: { id: true, name: true, color: true } },
} as const;

export const getPomodoroSessions = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await requireCurrentUser();
		return prisma.pomodoroSession.findMany({
			where: { userId: user.id },
			include: sessionInclude,
			orderBy: { startedAt: "desc" },
			take: 20,
		});
	},
);

export const startPomodoro = createServerFn({ method: "POST" })
	.validator(pomodoroInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		if (data.subjectId) {
			const subject = await prisma.subject.findFirst({
				where: { id: data.subjectId, userId: user.id },
			});
			if (!subject) throw new Error("Subject not found");
		}
		return prisma.pomodoroSession.create({
			data: { ...data, userId: user.id },
			include: sessionInclude,
		});
	});

export const completePomodoro = createServerFn({ method: "POST" })
	.validator(pomodoroIdSchema)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		return prisma.pomodoroSession.updateMany({
			where: { id: data.id, userId: user.id },
			data: { completed: true, endedAt: new Date() },
		});
	});
