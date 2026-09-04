import { createServerFn } from "@tanstack/react-start";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";

export const getCalendarData = createServerFn({ method: "GET" }).handler(async () => {
	const user = await requireCurrentUser();
	const [tasks, sessions, exams] = await Promise.all([
		prisma.task.findMany({ where: { userId: user.id, dueDate: { not: null } }, select: { id: true, title: true, dueDate: true, completed: true, subject: { select: { name: true } } }, orderBy: { dueDate: "asc" } }),
		prisma.studySession.findMany({ where: { userId: user.id }, select: { id: true, title: true, scheduledDate: true, durationMin: true, completed: true, subject: { select: { name: true } } }, orderBy: { scheduledDate: "asc" } }),
		prisma.exam.findMany({ where: { userId: user.id }, select: { id: true, title: true, examDate: true, completed: true, subject: { select: { name: true } } }, orderBy: { examDate: "asc" } }),
	]);
	return { tasks, sessions, exams };
});