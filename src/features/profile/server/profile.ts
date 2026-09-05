import { createServerFn } from "@tanstack/react-start";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { profileInput } from "../validation";

export const getProfile = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await requireCurrentUser();
		const [profile, studyMinutes, masteredSubjects, streakLogs] =
			await Promise.all([
				prisma.profile.findUnique({ where: { userId: user.id } }),
				prisma.studyLog.aggregate({
					where: { userId: user.id },
					_sum: { minutes: true },
				}),
				prisma.subject.count({
					where: { userId: user.id, tasks: { every: { completed: true } } },
				}),
				prisma.studyLog.findMany({
					where: { userId: user.id },
					select: { loggedAt: true },
					orderBy: { loggedAt: "desc" },
				}),
			]);
		const days = new Set(streakLogs.map((log) => log.loggedAt.toDateString()));
		let streak = 0;
		const date = new Date();
		for (;;) {
			if (!days.has(date.toDateString())) break;
			streak += 1;
			date.setDate(date.getDate() - 1);
		}
		return {
			user,
			profile,
			studyMinutes: studyMinutes._sum.minutes ?? 0,
			masteredSubjects,
			streak,
		};
	},
);

export const updateProfile = createServerFn({ method: "POST" })
	.validator(profileInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		const [updatedUser, profile] = await prisma.$transaction([
			prisma.user.update({
				where: { id: user.id },
				data: { name: data.name, image: data.avatarUrl },
			}),
			prisma.profile.upsert({
				where: { userId: user.id },
				create: {
					userId: user.id,
					name: data.name,
					theme: data.theme,
					avatarUrl: data.avatarUrl,
				},
				update: {
					name: data.name,
					theme: data.theme,
					avatarUrl: data.avatarUrl,
				},
			}),
		]);
		return { user: updatedUser, profile };
	});
