import { createServerFn } from "@tanstack/react-start";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";

export const getAnalytics = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await requireCurrentUser();
		const now = new Date();
		const start = new Date(now);
		start.setDate(start.getDate() - 6);
		start.setHours(0, 0, 0, 0);
		const [logs, pomodoros, tasks, subjects] = await Promise.all([
			prisma.studyLog.findMany({
				where: { userId: user.id, loggedAt: { gte: start } },
				include: { subject: { select: { name: true } } },
			}),
			prisma.pomodoroSession.findMany({
				where: { userId: user.id, startedAt: { gte: start } },
				select: { completed: true },
			}),
			prisma.task.findMany({
				where: { userId: user.id },
				select: { completed: true },
			}),
			prisma.subject.findMany({
				where: { userId: user.id },
				select: { name: true },
			}),
		]);
		const consistency = Array.from({ length: 7 }, (_, index) => {
			const date = new Date(start);
			date.setDate(start.getDate() + index);
			const minutes = logs
				.filter((log) => log.loggedAt.toDateString() === date.toDateString())
				.reduce((total, log) => total + log.minutes, 0);
			return {
				day: date.toLocaleDateString("en-US", { weekday: "short" }),
				hours: Math.round((minutes / 60) * 10) / 10,
			};
		});
		const subjectMinutes = new Map<string, number>();
		for (const log of logs)
			subjectMinutes.set(
				log.subject?.name ?? "General study",
				(subjectMinutes.get(log.subject?.name ?? "General study") ?? 0) +
					log.minutes,
			);
		const totalMinutes = logs.reduce((total, log) => total + log.minutes, 0);
		const subjectDistribution = [...subjectMinutes.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([name, minutes]) => ({
				name,
				hours: Math.round((minutes / 60) * 10) / 10,
				percentage: totalMinutes
					? Math.round((minutes / totalMinutes) * 100)
					: 0,
			}));
		const heatmap = Array.from({ length: 4 }, (_, row) =>
			Array.from({ length: 7 }, (_, column) => {
				const date = new Date(start);
				date.setDate(start.getDate() + column);
				const lower = row * 6;
				const upper = lower + 6;
				return Math.min(
					5,
					logs
						.filter(
							(log) =>
								log.loggedAt.toDateString() === date.toDateString() &&
								log.loggedAt.getHours() >= lower &&
								log.loggedAt.getHours() < upper,
						)
						.reduce((total, log) => total + log.minutes, 0) >= 60
						? 5
						: 0,
				);
			}),
		);
		let streak = 0;
		for (let index = 6; index >= 0; index -= 1)
			if (consistency[index].hours > 0) streak += 1;
			else break;
		return {
			consistency,
			subjectDistribution,
			heatmap,
			totalHours: Math.round((totalMinutes / 60) * 10) / 10,
			pomodoroRate: pomodoros.length
				? Math.round(
						(pomodoros.filter((session) => session.completed).length /
							pomodoros.length) *
							100,
					)
				: 0,
			taskRate: tasks.length
				? Math.round(
						(tasks.filter((task) => task.completed).length / tasks.length) *
							100,
					)
				: 0,
			streak,
			subjectCount: subjects.length,
		};
	},
);
