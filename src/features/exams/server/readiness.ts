import prisma from "#/lib/prisma-client";

function clamp(value: number) {
	return Math.max(0, Math.min(100, value));
}

export async function getExamReadinessScore({
	userId,
	subjectId,
	examDate,
	manualReadiness = 0,
}: {
	userId: string;
	subjectId: string | null;
	examDate: Date | string;
	manualReadiness?: number;
}) {
	const examDateValue = new Date(examDate);
	const now = new Date();
	const recentStudyWindow = new Date(now);
	recentStudyWindow.setDate(recentStudyWindow.getDate() - 30);

	const [tasks, studyMinutesResult] = await Promise.all([
		prisma.task.findMany({
			where: {
				userId,
				...(subjectId ? { subjectId } : {}),
			},
			select: { completed: true },
		}),
		prisma.studyLog.aggregate({
			where: {
				userId,
				...(subjectId ? { subjectId } : {}),
				loggedAt: { gte: recentStudyWindow },
			},
			_sum: { minutes: true },
		}),
	]);

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((task) => task.completed).length;
	const taskScore = totalTasks
		? Math.round((completedTasks / totalTasks) * 100)
		: 25;

	const minutesStudied = studyMinutesResult._sum.minutes ?? 0;
	const studyTargetMinutes = subjectId ? 180 : 240;
	const studyScore = Math.min(
		100,
		Math.round((minutesStudied / Math.max(studyTargetMinutes, 1)) * 100),
	);

	const calculatedScore = clamp(Math.round(taskScore * 0.7 + studyScore * 0.3));
	if (!manualReadiness) return calculatedScore;

	const blendedScore = clamp(
		Math.round(manualReadiness * 0.55 + calculatedScore * 0.45),
	);
	return blendedScore;
}

export async function getExamReadinessForEntity({
	userId,
	subjectId,
	examDate,
	manualReadiness,
}: {
	userId: string;
	subjectId: string | null;
	examDate: Date | string;
	manualReadiness: number;
}) {
	const score = await getExamReadinessScore({
		userId,
		subjectId,
		examDate,
		manualReadiness,
	});
	return score;
}
