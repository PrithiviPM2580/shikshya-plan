import { createServerFn } from "@tanstack/react-start";
import prisma from "#/lib/prisma-client";
import { requireCurrentUser } from "#/lib/server-auth";
import { avatarUploadInput, profileInput } from "../validation";

const avatarFolder = "shikshya-plan/avatars";
const avatarPublicId = (userId: string) => `${avatarFolder}/${userId}`;

async function getCloudinary() {
	const { v2: cloudinary } = await import("cloudinary");
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
	return cloudinary;
}

function isManagedAvatar(url: string | null | undefined) {
	return url?.includes(`/image/upload/`) && url.includes(`/${avatarFolder}/`);
}

function isCloudinaryConfigured() {
	return Boolean(
		process.env.CLOUDINARY_CLOUD_NAME &&
			process.env.CLOUDINARY_API_KEY &&
			process.env.CLOUDINARY_API_SECRET,
	);
}

export const uploadAvatar = createServerFn({ method: "POST" })
	.validator(avatarUploadInput)
	.handler(async ({ data }) => {
		const user = await requireCurrentUser();
		if (
			!process.env.CLOUDINARY_CLOUD_NAME ||
			!process.env.CLOUDINARY_API_KEY ||
			!process.env.CLOUDINARY_API_SECRET
		) {
			throw new Error("Cloudinary is not configured");
		}

		const cloudinary = await getCloudinary();
		const result = await cloudinary.uploader.upload(data.dataUrl, {
			folder: avatarFolder,
			public_id: user.id,
			overwrite: true,
			resource_type: "image",
			transformation: [
				{
					width: 512,
					height: 512,
					crop: "limit",
					quality: "auto",
					fetch_format: "auto",
				},
			],
		});

		return { secureUrl: result.secure_url };
	});

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
		const currentProfile = await prisma.profile.findUnique({
			where: { userId: user.id },
			select: { avatarUrl: true },
		});
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
					linkedinUrl: data.linkedinUrl,
					githubUrl: data.githubUrl,
					websiteUrl: data.websiteUrl,
					pomodoroLength: data.pomodoroLength,
					studyView: data.studyView,
					showCompletedTasks: data.showCompletedTasks,
					reminders: data.reminders,
					taskReminders: data.taskReminders,
					examReminders: data.examReminders,
					sessionReminders: data.sessionReminders,
				},
				update: {
					name: data.name,
					theme: data.theme,
					avatarUrl: data.avatarUrl,
					linkedinUrl: data.linkedinUrl,
					githubUrl: data.githubUrl,
					websiteUrl: data.websiteUrl,
					pomodoroLength: data.pomodoroLength,
					studyView: data.studyView,
					showCompletedTasks: data.showCompletedTasks,
					reminders: data.reminders,
					taskReminders: data.taskReminders,
					examReminders: data.examReminders,
					sessionReminders: data.sessionReminders,
				},
			}),
		]);
		if (
			currentProfile?.avatarUrl &&
			!data.avatarUrl &&
			isManagedAvatar(currentProfile.avatarUrl) &&
			isCloudinaryConfigured()
		) {
			const cloudinary = await getCloudinary();
			await cloudinary.uploader.destroy(avatarPublicId(user.id), {
				resource_type: "image",
				invalidate: true,
			});
		}
		return { user: updatedUser, profile };
	});
