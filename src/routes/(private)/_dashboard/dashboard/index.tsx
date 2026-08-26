import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	Check,
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

export const Route = createFileRoute("/(private)/_dashboard/dashboard/")({
	component: RouteComponent,
});

const studyData = [
	{ day: "Mon", hours: 2.2 },
	{ day: "Tue", hours: 1.8 },
	{ day: "Wed", hours: 1.4 },
	{ day: "Thu", hours: 3.2 },
	{ day: "Fri", hours: 4.1 },
	{ day: "Sat", hours: 1.2 },
	{ day: "Sun", hours: 3.8 },
];

const schedule = [
	{
		time: "09:00",
		title: "Advanced Calculus Lecture",
		detail: "Room 302 - Dr. Smith",
	},
	{
		time: "11:00",
		title: "Physics Problem Set",
		detail: "Library Study Room B",
		active: true,
	},
	{ time: "14:30", title: "Literature Review", detail: "Read chapters 4-6" },
];

const planSubjects = [
	{ name: "Mathematics", progress: 72 },
	{ name: "Physics", progress: 48 },
	{ name: "Biology", progress: 64 },
];

const upcomingExams = [
	{
		subject: "Physics",
		title: "Mechanics midterm",
		date: "Aug 29",
		days: "3 days",
	},
	{
		subject: "Mathematics",
		title: "Calculus assessment",
		date: "Sep 05",
		days: "10 days",
	},
];

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
		<Card className="gap-3 rounded-xl border-0 bg-card/85 py-4 shadow-sm">
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
	return (
		<div className="w-full space-y-4">
			<div>
				<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
					Overview
				</p>
				<p className="mt-1 text-sm text-muted-foreground">
					Welcome back, Alex. You're 85% towards your daily goal.
				</p>
			</div>
			<div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
				<StatCard
					title="Daily Focus"
					value="4.5h"
					note="↑ 1.2h vs yesterday"
					icon={Clock3}
				/>
				<StatCard
					title="Tasks Done"
					value="12"
					note="12 of 16 tasks"
					icon={CheckCircle2}
					tone="green"
				/>
				<StatCard
					title="Goal Progress"
					value="85%"
					note="◎ On track for weekly goal"
					icon={LineChart}
				/>
				<StatCard
					title="Exams"
					value="2"
					note="△ Next: Physics (3 days)"
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
									12 of 16 tasks completed
								</p>
							</div>
							<Button size="sm" className="h-7 px-3 text-[11px]">
								<Plus /> Add Task
							</Button>
						</CardHeader>
						<CardContent className="space-y-3 px-4">
							<Progress value={75} className="h-1.5" />
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
									data={studyData}
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
								<span className="font-bold text-primary">62%</span>
							</div>
							<Progress value={62} className="h-2" />
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
							{upcomingExams.map((exam) => (
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
											{exam.subject} · {exam.date}
										</p>
									</div>
									<span className="whitespace-nowrap text-[10px] font-semibold text-destructive">
										{exam.days}
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
								<span className="text-xs font-semibold">32/50</span>
								<div className="flex size-11 items-center justify-center rounded-full border-2 border-primary-foreground/40 text-xs font-bold">
									64%
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
							{[
								[
									BookOpen,
									"Chapter 2",
									"Completed notes for Biology 101.",
									"2h ago",
								],
								[Check, "Math", "Scored 95% on Algebra weekly quiz.", "5h ago"],
								[
									Clock3,
									"Deep Work",
									"2 hours of uninterrupted programming.",
									"Yesterday",
								],
							].map(([Icon, title, detail, time]) => {
								const ActivityIcon = Icon as typeof BookOpen;
								return (
									<div
										key={title as string}
										className="flex gap-3 border-l border-primary/40 pl-3"
									>
										<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
											<ActivityIcon className="size-3.5" />
										</div>
										<div className="min-w-0">
											<p className="text-xs font-bold">
												{title as string}
												<span className="ml-1 font-normal text-muted-foreground">
													{time as string}
												</span>
											</p>
											<p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
												{detail as string}
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
