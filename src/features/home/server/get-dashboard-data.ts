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
					subjects: {
						select: {
							subject: {
								select: {
									name: true,
									tasks: { select: { completed: true } },
								},
							},
						},
					},
				},
			}),
		]);
		const now = new Date();
		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);
		const weekStart = new Date(todayStart);
		weekStart.setDate(weekStart.getDate() - 6);
		const tomorrow = new Date(todayStart);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const [
			todayTasks,
			todaySessions,
			logs,
			goals,
			upcomingExams,
			recentActivity,
		] = await Promise.all([
			prisma.task.findMany({
				where: {
					userId: session.user.id,
					dueDate: { gte: todayStart, lt: tomorrow },
				},
				include: { subject: { select: { name: true } } },
				orderBy: { dueDate: "asc" },
			}),
			prisma.studySession.findMany({
				where: {
					userId: session.user.id,
					scheduledDate: { gte: todayStart, lt: tomorrow },
				},
				include: { subject: { select: { name: true } } },
				orderBy: { scheduledDate: "asc" },
			}),
			prisma.studyLog.findMany({
				where: { userId: session.user.id, loggedAt: { gte: weekStart } },
				orderBy: { loggedAt: "asc" },
			}),
			prisma.goal.findMany({
				where: { userId: session.user.id, completed: false },
				orderBy: { createdAt: "desc" },
				take: 3,
			}),
			prisma.exam.findMany({
				where: {
					userId: session.user.id,
					completed: false,
					examDate: { gte: now },
				},
				include: { subject: { select: { name: true } } },
				orderBy: { examDate: "asc" },
				take: 3,
			}),
			prisma.studyLog.findMany({
				where: { userId: session.user.id },
				include: { subject: { select: { name: true } } },
				orderBy: { loggedAt: "desc" },
				take: 3,
			}),
		]);

		const studyData = Array.from({ length: 7 }, (_, index) => {
			const date = new Date(weekStart);
			date.setDate(weekStart.getDate() + index);
			const minutes = logs
				.filter((log) => log.loggedAt.toDateString() === date.toDateString())
				.reduce((total, log) => total + log.minutes, 0);
			return {
				day: date.toLocaleDateString("en-US", { weekday: "short" }),
				hours: Math.round((minutes / 60) * 10) / 10,
			};
		});

		return {
			userName: session.user.name,
			tasksDone,
			taskCount,
			examCount,
			plan,
			todayTasks,
			todaySessions,
			studyData,
			goals,
			upcomingExams,
			recentActivity,
		};
	},
);
