import "dotenv/config";
import { hashPassword } from "better-auth/crypto";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to run the seed");

const prisma = new PrismaClient({
	adapter: new PrismaNeon({ connectionString: databaseUrl }),
});

const demoEmail = "demo@shikshyaplan.com";
const demoPassword = "Demo@12345";

function daysFromToday(days: number) {
	const date = new Date();
	date.setHours(10, 0, 0, 0);
	date.setDate(date.getDate() + days);
	return date;
}

function daysAgo(days: number, hour = 18) {
	const date = new Date();
	date.setHours(hour, 0, 0, 0);
	date.setDate(date.getDate() - days);
	return date;
}

async function main() {
	await prisma.user.deleteMany({ where: { email: demoEmail } });

	const password = await hashPassword(demoPassword);
	const user = await prisma.user.create({
		data: {
			id: "seed-demo-user",
			name: "Demo Student",
			email: demoEmail,
			emailVerified: true,
			profiles: {
				create: {
					name: "Demo Student",
					program: "BSc Computer Science",
					semester: "Semester 4",
					weeklyHours: 18,
					targetGpa: 3.7,
					pomodoroLength: 25,
					studyView: "weekly",
				},
			},
			accounts: {
				create: {
					id: "seed-demo-account",
					issuer: "local:credential",
					accountId: "seed-demo-user",
					providerId: "credential",
					password,
				},
			},
		},
	});

	const subjects = await Promise.all(
		[
			["Data Structures", "#2563EB", "Algorithms, trees, graphs, and complexity"],
			["Database Systems", "#16A34A", "Relational design, SQL, and normalization"],
			["Operating Systems", "#EA580C", "Processes, memory, filesystems, and scheduling"],
			["Web Engineering", "#9333EA", "Modern full-stack application development"],
			["Technical Communication", "#DB2777", "Reports, presentations, and documentation"],
		].map(([name, color, description]) =>
			prisma.subject.create({
				data: { userId: user.id, name, color, description },
			}),
		),
	);
	const [dataStructures, databases, operatingSystems, webEngineering, communication] =
		subjects;

	const plans = await Promise.all([
		prisma.studyPlan.create({
			data: {
				userId: user.id,
				title: "Midterm Preparation",
				description: "Build a consistent routine for the upcoming midterm exams.",
				goal: "Complete revision and practice questions for core subjects.",
				startDate: daysAgo(4),
				endDate: daysFromToday(17),
				status: "ACTIVE",
				subjects: {
					create: [
						{ userId: user.id, subjectId: dataStructures.id },
						{ userId: user.id, subjectId: databases.id },
						{ userId: user.id, subjectId: operatingSystems.id },
					],
				},
			},
		}),
		prisma.studyPlan.create({
			data: {
				userId: user.id,
				title: "Web Engineering Portfolio",
				description: "Finish the semester project and prepare the final presentation.",
				goal: "Deliver a tested full-stack study-planning application.",
				startDate: daysAgo(12),
				endDate: daysFromToday(24),
				status: "ACTIVE",
				subjects: {
					create: [
						{ userId: user.id, subjectId: webEngineering.id },
						{ userId: user.id, subjectId: communication.id },
					],
				},
			},
		}),
		prisma.studyPlan.create({
			data: {
				userId: user.id,
				title: "Discrete Mathematics Review",
				description: "Completed revision plan from the previous assessment period.",
				goal: "Review foundational problem-solving techniques.",
				startDate: daysAgo(32),
				endDate: daysAgo(14),
				status: "COMPLETED",
			},
		}),
	]);
	const [midtermPlan, portfolioPlan] = plans;

	const sessions = await Promise.all([
		["Arrays and Linked Lists", dataStructures.id, midtermPlan.id, -2, 60, true],
		["SQL Joins and Aggregation", databases.id, midtermPlan.id, -1, 75, true],
		["Process Scheduling Practice", operatingSystems.id, midtermPlan.id, 1, 60, false],
		["Database Normalization", databases.id, midtermPlan.id, 3, 60, false],
		["React State Management", webEngineering.id, portfolioPlan.id, 0, 90, false],
		["API Documentation Draft", communication.id, portfolioPlan.id, 2, 45, false],
		["Graph Traversal Problems", dataStructures.id, midtermPlan.id, 5, 90, false],
		["Memory Management Review", operatingSystems.id, midtermPlan.id, 7, 60, false],
		["Portfolio Presentation Practice", communication.id, portfolioPlan.id, 10, 45, false],
	].map(([title, subjectId, planId, day, durationMin, completed]) =>
		prisma.studySession.create({
			data: {
				userId: user.id,
				title: title as string,
				subjectId: subjectId as string,
				planId: planId as string,
				scheduledDate: day as number < 0 ? daysAgo(Math.abs(day as number)) : daysFromToday(day as number),
				durationMin: durationMin as number,
				completed: completed as boolean,
				notes: completed ? "Completed during the planned study block." : null,
			},
		}),
		),
	);

	const taskData = [
		["Implement binary search exercises", dataStructures.id, -1, "HIGH", true, sessions[0].id],
		["Review tree traversal notes", dataStructures.id, 1, "MEDIUM", false, sessions[6].id],
		["Solve graph shortest-path problems", dataStructures.id, 5, "HIGH", false, sessions[6].id],
		["Practice SQL joins", databases.id, -2, "HIGH", true, sessions[1].id],
		["Normalize the library schema", databases.id, 3, "HIGH", false, sessions[3].id],
		["Write five aggregation queries", databases.id, 6, "MEDIUM", false, null],
		["Compare CPU scheduling algorithms", operatingSystems.id, 1, "MEDIUM", false, sessions[2].id],
		["Review virtual memory concepts", operatingSystems.id, 7, "HIGH", false, sessions[7].id],
		["Build the dashboard loading state", webEngineering.id, -3, "HIGH", true, sessions[4].id],
		["Add responsive mobile layout", webEngineering.id, 4, "MEDIUM", false, sessions[4].id],
		["Write API usage documentation", communication.id, 2, "MEDIUM", false, sessions[5].id],
		["Prepare project presentation slides", communication.id, 10, "LOW", false, sessions[8].id],
		["Organize lecture notes", null, 0, "LOW", true, null],
		["Submit weekly reflection", null, 8, "LOW", false, null],
		["Review instructor feedback", communication.id, -5, "MEDIUM", true, null],
	];
	await Promise.all(
		taskData.map(([title, subjectId, due, priority, completed, sessionId]) =>
			prisma.task.create({
				data: {
					userId: user.id,
					title: title as string,
					subjectId: (subjectId as string | null) ?? null,
					sessionId: (sessionId as string | null) ?? null,
					dueDate: daysFromToday(due as number),
					priority: priority as "LOW" | "MEDIUM" | "HIGH",
					completed: completed as boolean,
					description: `Demo task for ${title as string}.`,
				},
			}),
		),
	);

	await Promise.all([
		prisma.exam.create({
			data: {
				userId: user.id,
				subjectId: dataStructures.id,
				title: "Data Structures Midterm",
				examDate: daysFromToday(12),
				syllabus: "Arrays, linked lists, stacks, queues, trees, and graphs.",
				readinessPercentage: 64,
			},
		}),
		prisma.exam.create({
			data: {
				userId: user.id,
				subjectId: databases.id,
				title: "Database Systems Midterm",
				examDate: daysFromToday(18),
				syllabus: "Relational algebra, SQL, normalization, and transactions.",
				readinessPercentage: 48,
			},
		}),
		prisma.exam.create({
			data: {
				userId: user.id,
				subjectId: operatingSystems.id,
				title: "Operating Systems Quiz",
				examDate: daysFromToday(7),
				syllabus: "Processes, scheduling, synchronization, and virtual memory.",
				readinessPercentage: 57,
			},
		}),
		prisma.exam.create({
			data: {
				userId: user.id,
				subjectId: communication.id,
				title: "Technical Presentation",
				examDate: daysAgo(10),
				syllabus: "Project presentation and technical documentation.",
				readinessPercentage: 100,
				completed: true,
			},
		}),
	]);

	await Promise.all([
		prisma.goal.create({
			data: {
				userId: user.id,
				title: "Study 18 hours this week",
				target: 18,
				progress: 11,
				deadline: daysFromToday(5),
			},
		}),
		prisma.goal.create({
			data: {
				userId: user.id,
				title: "Complete database revision",
				target: 100,
				progress: 55,
				deadline: daysFromToday(16),
			},
		}),
		prisma.goal.create({
			data: {
				userId: user.id,
				title: "Finish portfolio project",
				target: 100,
				progress: 72,
				deadline: daysFromToday(22),
			},
		}),
		prisma.goal.create({
			data: {
				userId: user.id,
				title: "Maintain a five-day study streak",
				target: 5,
				progress: 3,
				deadline: daysFromToday(3),
			},
		}),
	]);

	const completedSessions = sessions.filter((session) => session.completed);
	await Promise.all(
		[
			[dataStructures.id, 55, 1, completedSessions[0].id],
			[databases.id, 70, 2, completedSessions[1].id],
			[operatingSystems.id, 45, 3, null],
			[webEngineering.id, 80, 4, null],
			[communication.id, 35, 5, null],
			[dataStructures.id, 65, 6, null],
			[databases.id, 50, 7, null],
		].map(([subjectId, minutes, ago, sessionId]) =>
			prisma.studyLog.create({
				data: {
					userId: user.id,
					subjectId: subjectId as string,
					minutes: minutes as number,
					loggedAt: daysAgo(ago as number),
					sessionId: (sessionId as string | null) ?? null,
				},
			}),
		),
	);

	await prisma.pomodoroSession.createMany({
		data: [
			[dataStructures.id, "Binary search practice", 25, true, 1],
			[databases.id, "SQL revision", 25, true, 2],
			[operatingSystems.id, "Scheduling algorithms", 25, false, 3],
			[webEngineering.id, "Dashboard implementation", 50, true, 4],
			[communication.id, "Presentation outline", 25, true, 5],
		].map(([subjectId, title, focusMinutes, completed, ago]) => ({
			userId: user.id,
			subjectId: subjectId as string,
			title: title as string,
			focusMinutes: focusMinutes as number,
			completed: completed as boolean,
			startedAt: daysAgo(ago as number),
			endedAt: completed ? daysAgo(ago as number, 19) : null,
		})),
	});

	console.log(`Seeded demo account: ${demoEmail}`);
	console.log(`Demo password: ${demoPassword}`);
	console.log("Created 5 subjects, 3 plans, 9 sessions, 15 tasks, 4 exams, 4 goals, 7 study logs, and 5 Pomodoro sessions.");
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
