import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";

const analyticsRange = z.enum(["today", "week", "fifteenDays", "month"]);

export const getAnalytics = createServerFn({ method: "GET" })
	.validator(z.object({ range: analyticsRange }).default({ range: "week" }))
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const now = new Date();
		const start = new Date(now);
		start.setHours(0, 0, 0, 0);
		const days =
			data.range === "today"
				? 1
				: data.range === "fifteenDays"
					? 15
					: data.range === "month"
						? 30
						: 7;
		start.setDate(start.getDate() - days + 1);
		const [logs, pomodoros, tasks, subjects, profile] = await Promise.all([
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
			prisma.profile.findUnique({
				where: { userId: user.id },
				select: { weeklyHours: true, targetGpa: true },
			}),
		]);
		const consistency = Array.from({ length: days }, (_, index) => {
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
			Array.from({ length: Math.min(days, 7) }, (_, column) => {
				const date = new Date(now);
				date.setDate(now.getDate() - Math.min(days, 7) + column + 1);
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
		for (let index = consistency.length - 1; index >= 0; index -= 1)
			if (consistency[index].hours > 0) streak += 1;
			else break;
		const targetHours = profile?.weeklyHours ?? 0;
		const expectedHours = targetHours ? (targetHours / 7) * days : 0;
		const paceRatio = expectedHours ? totalMinutes / 60 / expectedHours : 0;
		const paceStatus = !targetHours
			? "Set a weekly study target"
			: paceRatio >= 1.1
				? "Ahead of schedule"
				: paceRatio >= 0.75
					? "On track"
					: "Needs attention";
		const focusRecommendation = subjectDistribution.length
			? `Increase ${subjectDistribution[subjectDistribution.length - 1].name} focus time by 10%`
			: "Log a study session to unlock subject recommendations";
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
			targetGpa: profile?.targetGpa ?? null,
			weeklyTargetHours: targetHours,
			paceStatus,
			focusRecommendation,
		};
	});
