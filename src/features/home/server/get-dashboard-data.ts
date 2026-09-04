import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";
import prisma from "#/lib/prisma-client";

export const getDashboardData = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await auth.api.getSession({
			headers: await getRequestHeaders(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const [tasksDone, taskCount, examCount, plan] = await Promise.all([
			prisma.task.count({
				where: { userId: session.user.id, completed: true },
			}),
			prisma.task.count({ where: { userId: session.user.id } }),
			prisma.exam.count({
				where: { userId: session.user.id, completed: false },
			}),
			prisma.studyPlan.findFirst({
				where: { userId: session.user.id, status: "ACTIVE" },
				orderBy: { createdAt: "desc" },
				select: {
					title: true,
					subjects: { select: { subject: { select: { name: true } } } },
				},
			}),
		]);

		return {
			userName: session.user.name,
			tasksDone,
			taskCount,
			examCount,
			plan,
		};
	},
);
