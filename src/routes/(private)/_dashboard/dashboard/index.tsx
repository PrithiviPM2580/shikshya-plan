import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	CheckCircle2,
	CircleAlert,
	Clock3,
	LineChart,
	Plus,
	Target,
} from "lucide-react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from "recharts";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Progress } from "#/components/ui/progress.tsx";
import { getDashboardData } from "#/features/home/server/get-dashboard-data";

export const Route = createFileRoute("/(private)/_dashboard/dashboard/")({
	loader: () => getDashboardData(),
	component: RouteComponent,
});

function StatCard({
	title,
	value,
	note,
	icon: Icon,
	tone = "teal",
}: {
	title: string;
	value: string;
	note: string;
	icon: typeof Clock3;
	tone?: "teal" | "green" | "red";
}) {
	const noteClass = tone === "red" ? "text-red-500" : "text-muted-foreground";
	return (
		<Card className="gap-3 rounded-xl border border-[#173a40]/10 bg-white/85 py-4 shadow-sm dark:border-white/10 dark:bg-[#18262b]">
			<CardHeader className="flex-row items-center justify-between gap-2 px-4 pb-0">
				<CardTitle className="text-xs font-semibold text-muted-foreground">
					{title}
				</CardTitle>
				<Icon
					className={`size-4 ${tone === "red" ? "text-destructive" : "text-primary"}`}
				/>
			</CardHeader>
			<CardContent className="px-4">
				<p className="mt-1 text-xl font-bold tracking-tight">{value}</p>
				<p className={`mt-1 text-[11px] leading-tight ${noteClass}`}>{note}</p>
			</CardContent>
		</Card>
	);
}

function RouteComponent() {
	const dashboard = Route.useLoaderData();
	const schedule = [
		...dashboard.todaySessions.map((session) => ({
			time: new Date(session.scheduledDate).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			title: session.title,
			detail: session.subject?.name ?? "General study",
			active: !session.completed,
		})),
		...dashboard.todayTasks.map((task) => ({
			time: task.dueDate
				? new Date(task.dueDate).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})
				: "Today",
			title: task.title,
			detail: task.subject?.name ?? "General task",
			active: !task.completed,
		})),
	].slice(0, 5);
	const planSubjects =
		dashboard.plan?.subjects.map(({ subject }) => {
			const completed = subject.tasks.filter((task) => task.completed).length;
			return {
				name: subject.name,
				progress: subject.tasks.length
					? Math.round((completed / subject.tasks.length) * 100)
					: 0,
			};
		}) ?? [];
	const completedGoal = dashboard.goals[0];
	const todayMinutes = dashboard.todaySessions
		.filter((session) => session.completed)
		.reduce((total, session) => total + session.durationMin, 0);
	const taskSummary = dashboard.taskCount
		? `${dashboard.tasksDone} of ${dashboard.taskCount} tasks`
		: "No tasks yet";

	return (
		<div className="w-full space-y-4">
			<div>
				<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
					Overview
				</p>
				<p className="mt-1 text-sm text-muted-foreground">
					Welcome back, {dashboard.userName}. Start planning your next focused
					session.
				</p>
			</div>
			<div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
				<StatCard
					title="Daily Focus"
					value={`${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m`}
					note="Completed study sessions today"
					icon={Clock3}
				/>
				<StatCard
					title="Tasks Done"
					value={String(dashboard.tasksDone)}
					note={taskSummary}
					icon={CheckCircle2}
					tone="green"
				/>
				<StatCard
					title="Goal Progress"
					value={
						completedGoal
							? `${Math.min(100, Math.round((completedGoal.progress / completedGoal.target) * 100))}%`
							: "0%"
					}
					note={completedGoal ? completedGoal.title : "No active goals"}
					icon={LineChart}
				/>
				<StatCard
					title="Exams"
					value={String(dashboard.examCount)}
					note="Upcoming exams"
					icon={CircleAlert}
					tone="red"
				/>
			</div>
			<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
				<div className="space-y-4">
					<Card className="rounded-xl border-0 bg-card/90 py-4 shadow-sm">
						<CardHeader className="flex-row items-center justify-between px-4 pb-2">
							<div>
								<CardTitle className="text-sm font-bold">
									Today's Schedule
								</CardTitle>
								<p className="mt-1 text-[11px] text-muted-foreground">
									{taskSummary}
								</p>
							</div>
							<Button size="sm" className="h-7 px-3 text-[11px]">
								<Plus /> Add Task
							</Button>
						</CardHeader>
						<CardContent className="space-y-3 px-4">
							<Progress
								value={
									dashboard.taskCount
										? (dashboard.tasksDone / dashboard.taskCount) * 100
										: 0
								}
								className="h-1.5"
							/>
							{schedule.map((item) => (
								<div
									key={item.time}
									className={`grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-3 ${item.active ? "bg-primary/10" : ""}`}
								>
									<span className="text-[11px] text-muted-foreground">
										{item.time}
									</span>
									<div
										className={`border-l-2 pl-3 ${item.active ? "border-primary" : "border-primary/40"}`}
									>
										<p className="text-xs font-semibold">{item.title}</p>
										<p className="text-[11px] text-muted-foreground">
											{item.detail}
										</p>
									</div>
									{item.active ? (
										<Badge className="col-start-3 row-start-1 row-span-2 h-5 bg-primary/15 px-2 text-[10px] text-primary hover:bg-primary/20">
											In Progress
										</Badge>
									) : (
										<span className="size-4 rounded-full border border-muted-foreground/40" />
									)}
								</div>
							))}
						</CardContent>
					</Card>
					<Card className="rounded-xl border-0 bg-card/90 py-4 shadow-sm">
						<CardHeader className="flex-row items-center justify-between px-4 pb-0">
							<CardTitle className="text-sm font-bold">
								Progress Analytics
							</CardTitle>
							<LineChart className="size-4 text-primary" />
						</CardHeader>
						<CardContent className="h-52 px-2 pt-4">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={dashboard.studyData}
									margin={{ top: 8, right: 4, left: 4, bottom: 0 }}
								>
									<defs>
										<linearGradient id="studyFill" x1="0" y1="0" x2="0" y2="1">
											<stop
												offset="0%"
												stopColor="var(--primary)"
												stopOpacity={0.3}
											/>
											<stop
												offset="100%"
												stopColor="var(--primary)"
												stopOpacity={0.02}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid vertical={false} stroke="transparent" />
									<XAxis
										dataKey="day"
										axisLine={false}
										tickLine={false}
										tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
									/>
									<Tooltip
										contentStyle={{
											borderRadius: 8,
											border: "1px solid var(--border)",
											fontSize: 12,
										}}
									/>
									<Area
										type="natural"
										dataKey="hours"
										stroke="var(--primary)"
										strokeWidth={2.5}
										fill="url(#studyFill)"
										dot={{
											r: 3,
											fill: "var(--card)",
											stroke: "var(--primary)",
											strokeWidth: 2,
										}}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
					<Card className="rounded-xl border-0 bg-card/90 py-4 shadow-sm">
						<CardHeader className="px-4 pb-2">
							<CardTitle className="text-sm font-bold">
								Active Study Plan
							</CardTitle>
							<p className="mt-1 text-[11px] text-muted-foreground">
								Exam preparation plan
							</p>
						</CardHeader>
						<CardContent className="space-y-3 px-4">
							<div className="flex items-center justify-between text-xs">
								<span className="font-semibold">Overall progress</span>
								<span className="font-bold text-primary">
									{planSubjects.length
										? Math.round(
												planSubjects.reduce(
													(total, subject) => total + subject.progress,
													0,
												) / planSubjects.length,
											)
										: 0}
									%
								</span>
							</div>
							<Progress
								value={
									planSubjects.length
										? planSubjects.reduce(
												(total, subject) => total + subject.progress,
												0,
											) / planSubjects.length
										: 0
								}
								className="h-2"
							/>
							{planSubjects.map((subject) => (
								<div key={subject.name} className="space-y-1.5">
									<div className="flex justify-between text-[11px]">
										<span className="text-muted-foreground">
											{subject.name}
										</span>
										<span className="font-semibold">{subject.progress}%</span>
									</div>
									<Progress value={subject.progress} className="h-1.5" />
								</div>
							))}
						</CardContent>
					</Card>
					<Card className="rounded-xl border-0 bg-card/90 py-4 shadow-sm">
						<CardHeader className="px-4 pb-2">
							<CardTitle className="text-sm font-bold">
								Upcoming Exams
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1 px-4">
							{dashboard.upcomingExams.map((exam) => (
								<div
									key={exam.title}
									className="flex items-center gap-3 border-b border-border/60 py-2.5 last:border-0"
								>
									<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
										<CircleAlert className="size-4" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-xs font-semibold">
											{exam.title}
										</p>
										<p className="text-[11px] text-muted-foreground">
											{exam.subject?.name ?? "General"} ·{" "}
											{new Date(exam.examDate).toLocaleDateString()}
										</p>
									</div>
									<span className="whitespace-nowrap text-[10px] font-semibold text-destructive">
										{Math.max(
											0,
											Math.ceil(
												(new Date(exam.examDate).getTime() - Date.now()) /
													86400000,
											),
										)}
										d
									</span>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
				<div className="space-y-4">
					<Card className="rounded-xl border-0 bg-primary py-5 text-primary-foreground shadow-sm">
						<CardContent className="px-4">
							<div className="flex items-center justify-between">
								<p className="text-sm font-bold">Next Milestone</p>
								<Target className="size-4 text-primary-foreground/75" />
							</div>
							<p className="mt-4 text-xs text-primary-foreground/80">
								Complete 50 study hours this month.
							</p>
							<div className="mt-4 flex items-end justify-between">
								<span className="text-xs font-semibold">
									{completedGoal
										? `${completedGoal.progress}/${completedGoal.target}`
										: "0/0"}
								</span>
								<div className="flex size-11 items-center justify-center rounded-full border-2 border-primary-foreground/40 text-xs font-bold">
									{completedGoal
										? `${Math.min(100, Math.round((completedGoal.progress / completedGoal.target) * 100))}%`
										: "0%"}
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="rounded-xl border-0 bg-card/90 py-4 shadow-sm">
						<CardHeader className="px-4 pb-2">
							<CardTitle className="text-sm font-bold">
								Recent Activity
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 px-4">
							{dashboard.recentActivity.map((activity) => {
								return (
									<div
										key={activity.id}
										className="flex gap-3 border-l border-primary/40 pl-3"
									>
										<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
											<BookOpen className="size-3.5" />
										</div>
										<div className="min-w-0">
											<p className="text-xs font-bold">
												{activity.subject?.name ?? "Study session"}
												<span className="ml-1 font-normal text-muted-foreground">
													{new Date(activity.loggedAt).toLocaleDateString()}
												</span>
											</p>
											<p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
												Completed {activity.minutes} minutes of study.
											</p>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
