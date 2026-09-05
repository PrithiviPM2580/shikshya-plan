import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "./auth";
import prisma from "./prisma-client";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await auth.api.getSession({
			headers: await getRequestHeaders(),
		});

		return session?.user ?? null;
	},
);

export const requireCurrentUser = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await getCurrentUser();

		if (!user) {
			throw new Error("Unauthorized");
		}

		return user;
	},
);

export const getOnboardingStatus = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await auth.api.getSession({
			headers: await getRequestHeaders(),
		});

		if (!session) {
			return { user: null, isComplete: false };
		}

		const profile = await prisma.profile.findUnique({
			where: { userId: session.user.id },
			select: { userId: true },
		});

		return { user: session.user, isComplete: profile !== null };
	},
);

export const getShellData = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await requireCurrentUser();
		const start = new Date();
		start.setHours(0, 0, 0, 0);
		const end = new Date(start);
		end.setDate(end.getDate() + 1);
		const [tasks, goal, profile, reminders] = await Promise.all([
			prisma.task.findMany({
				where: { userId: user.id, dueDate: { gte: start, lt: end } },
				select: { completed: true },
			}),
			prisma.goal.findFirst({
				where: { userId: user.id, completed: false },
				orderBy: { createdAt: "desc" },
				select: { title: true, progress: true, target: true },
			}),
			prisma.profile.findUnique({
				where: { userId: user.id },
				select: {
					avatarUrl: true,
					reminders: true,
					taskReminders: true,
					examReminders: true,
					sessionReminders: true,
				},
			}),
			prisma.$transaction([
				prisma.task.findMany({
					where: {
						userId: user.id,
						completed: false,
						dueDate: { gte: new Date() },
					},
					select: { id: true, title: true, dueDate: true },
					orderBy: { dueDate: "asc" },
					take: 20,
				}),
				prisma.exam.findMany({
					where: {
						userId: user.id,
						completed: false,
						examDate: { gte: new Date() },
					},
					select: { id: true, title: true, examDate: true },
					orderBy: { examDate: "asc" },
					take: 20,
				}),
				prisma.studySession.findMany({
					where: {
						userId: user.id,
						completed: false,
						scheduledDate: { gte: new Date() },
					},
					select: { id: true, title: true, scheduledDate: true },
					orderBy: { scheduledDate: "asc" },
					take: 20,
				}),
			]),
		]);
		return {
			user: {
				name: profile ? (profile.avatarUrl ? user.name : user.name) : user.name,
				email: user.email,
				avatar: profile?.avatarUrl ?? user.image ?? "",
			},
			tasksDone: tasks.filter((task) => task.completed).length,
			taskCount: tasks.length,
			goal,
			notificationPreferences: {
				daily: profile?.reminders ?? true,
				tasks: profile?.taskReminders ?? true,
				exams: profile?.examReminders ?? true,
				sessions: profile?.sessionReminders ?? true,
			},
			reminders: {
				tasks: reminders[0],
				exams: reminders[1],
				sessions: reminders[2],
			},
		};
	},
);
