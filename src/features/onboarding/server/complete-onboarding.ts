import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "#/lib/auth";
import prisma from "#/lib/prisma-client";

const onboardingSchema = z.object({
	programName: z.string().min(1),
	semester: z.string().min(1),
	courses: z.array(
		z.object({
			code: z.string().min(1),
			name: z.string().min(1),
			credits: z.number().int().positive(),
		}),
	),
	weeklyHours: z.number().int().min(0).max(40),
	targetGpa: z.number().min(0).max(4),
});

export const completeOnboarding = createServerFn({ method: "POST" })
	.validator(onboardingSchema)
	.handler(async ({ data }) => {
		const session = await auth.api.getSession({
			headers: await getRequestHeaders(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		return prisma.$transaction(async (tx) => {
			const profile = await tx.profile.upsert({
				where: { userId: session.user.id },
				create: { userId: session.user.id, name: session.user.name },
				update: { name: session.user.name },
				select: { userId: true },
			});

			const subjects = await Promise.all(
				data.courses.map((course, index) =>
					tx.subject.create({
						data: {
							userId: session.user.id,
							name: course.name,
							color: index % 2 === 0 ? "#0F766E" : "#D97706",
						},
					}),
				),
			);

			const plan = await tx.studyPlan.create({
				data: {
					userId: session.user.id,
					title: `${data.programName} - ${data.semester}`,
					description: "Your initial study plan",
					goal: `Reach a ${data.targetGpa.toFixed(1)} GPA with ${data.weeklyHours} study hours per week.`,
					subjects: {
						create: subjects.map((subject) => ({
							subjectId: subject.id,
							userId: session.user.id,
						})),
					},
				},
			});

			await tx.goal.create({
				data: {
					userId: session.user.id,
					title: `Achieve a ${data.targetGpa.toFixed(1)} GPA`,
					target: data.weeklyHours * 4,
				},
			});

			return { profileId: profile.userId, planId: plan.id };
		});
	});
