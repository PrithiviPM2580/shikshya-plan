import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	Brain,
	CheckCircle2,
	Clock3,
	Flame,
	Info,
	TrendingUp,
} from "lucide-react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Progress } from "#/components/ui/progress.tsx";
import { getAnalytics } from "#/features/analytics/server/analytics";

export const Route = createFileRoute("/(private)/_dashboard/analytics/")({
	loader: () => getAnalytics(),
	component: RouteComponent,
});

function RouteComponent() {
	const analytics = Route.useLoaderData();

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Study analytics
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">
						Your performance
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Insights and progress over time.
					</p>
				</div>
				<Button variant="outline">
					Last 7 Days <TrendingUp />
				</Button>
			</section>
			<section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardContent className="p-4">
						<Clock3 className="size-4 text-primary" />
						<p className="mt-3 text-lg font-bold">{analytics.totalHours}h</p>
						<p className="text-[10px] uppercase text-muted-foreground">
							Total study hours
						</p>
					</CardContent>
				</Card>
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardContent className="p-4">
						<CheckCircle2 className="size-4 text-primary" />
						<p className="mt-3 text-lg font-bold">{analytics.taskRate}%</p>
						<p className="text-[10px] uppercase text-muted-foreground">
							Weekly goal
						</p>
					</CardContent>
				</Card>
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardContent className="p-4">
						<Brain className="size-4 text-primary" />
						<p className="mt-3 text-lg font-bold">{analytics.pomodoroRate}%</p>
						<p className="text-[10px] uppercase text-muted-foreground">
							Avg focus score
						</p>
					</CardContent>
				</Card>
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardContent className="p-4">
						<Flame className="size-4 text-primary" />
						<p className="mt-3 text-lg font-bold">{analytics.streak}</p>
						<p className="text-[10px] uppercase text-muted-foreground">
							Day streak
						</p>
					</CardContent>
				</Card>
			</section>

			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardHeader className="flex-row items-center justify-between px-4 pb-0 pt-4">
						<CardTitle className="text-sm">Study Consistency</CardTitle>
						<div className="flex gap-3 text-[10px] text-muted-foreground">
							<span>
								<i className="mr-1 inline-block size-2 rounded-full bg-primary" />
								Hours
							</span>
							<span>
								<i className="mr-1 inline-block size-2 rounded-full bg-secondary" />
								Focus Score
							</span>
						</div>
					</CardHeader>
					<CardContent className="h-64 px-2 pb-4 pt-4">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart
								data={analytics.consistency}
								margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
							>
								<defs>
									<linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="0%"
											stopColor="var(--primary)"
											stopOpacity={0.25}
										/>
										<stop
											offset="100%"
											stopColor="var(--primary)"
											stopOpacity={0.02}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid
									vertical={false}
									stroke="var(--border)"
									strokeDasharray="3 3"
								/>
								<XAxis
									dataKey="day"
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
									width={28}
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
									fill="url(#hoursFill)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardHeader className="flex-row items-center justify-between px-4 pb-2 pt-4">
						<CardTitle className="text-sm">Focus Quality</CardTitle>
						<Info className="size-4 text-muted-foreground" />
					</CardHeader>
					<CardContent className="space-y-4 px-4 pb-5">
						<div>
							<div className="flex justify-between text-xs">
								<span>Pomodoro completion</span>
								<span className="font-semibold text-primary">
									{analytics.pomodoroRate}%
								</span>
							</div>
							<Progress value={analytics.pomodoroRate} className="mt-2 h-1.5" />
						</div>
						<div>
							<div className="flex justify-between text-xs">
								<span>Flow state achieved</span>
								<span className="font-semibold text-primary">
									{analytics.taskRate}%
								</span>
							</div>
							<Progress value={analytics.taskRate} className="mt-2 h-1.5" />
						</div>
						<div>
							<p className="mb-2 text-[10px] uppercase text-muted-foreground">
								Common distractions
							</p>
							{[["Tracked study subjects", String(analytics.subjectCount)]].map(
								([name, value]) => (
									<div
										key={name}
										className="mb-2 flex items-center justify-between rounded-md bg-muted/60 px-2 py-1.5 text-[11px]"
									>
										<span>{name}</span>
										<span className="text-muted-foreground">{value}</span>
									</div>
								),
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-5 md:grid-cols-2">
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardHeader className="px-4 pb-2 pt-4">
						<CardTitle className="text-sm">Subject Distribution</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 px-4 pb-5">
						{analytics.subjectDistribution.map(
							({ name, hours, percentage }) => (
								<div key={name}>
									<div className="flex justify-between text-xs">
										<span>{name}</span>
										<span className="text-muted-foreground">
											{hours}h ({percentage}%)
										</span>
									</div>
									<Progress value={percentage} className="mt-2 h-1.5" />
								</div>
							),
						)}
					</CardContent>
				</Card>
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardHeader className="flex-row items-center justify-between px-4 pb-2 pt-4">
						<CardTitle className="text-sm">Peak Study Times</CardTitle>
						<span className="text-[10px] text-muted-foreground">
							Darker = more intense
						</span>
					</CardHeader>
					<CardContent className="px-4 pb-5">
						<div className="grid grid-cols-[58px_repeat(7,minmax(0,1fr))] gap-1 text-center text-[9px]">
							<span />
							{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
								<span key={`${day}-${index}`} className="text-muted-foreground">
									{day}
								</span>
							))}
							{["Morning", "Afternoon", "Evening", "Night"].map(
								(label, row) => (
									<div key={label} className="contents">
										<span className="self-center text-left text-[10px] text-muted-foreground">
											{label}
										</span>
										{analytics.heatmap[row].map((level, index) => (
											<span
												key={`${row}-${index}`}
												className={`h-6 rounded-sm ${level === 0 ? "bg-muted" : level === 1 ? "bg-primary/15" : level === 2 ? "bg-primary/30" : level === 3 ? "bg-primary/50" : level === 4 ? "bg-primary/70" : "bg-primary"}`}
											/>
										))}
									</div>
								),
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="rounded-xl border bg-card py-0 shadow-sm">
				<CardContent className="p-5">
					<div className="flex items-start gap-3">
						<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Activity className="size-4" />
						</div>
						<div>
							<CardTitle className="text-sm">
								Goal Completion Forecast
							</CardTitle>
							<p className="mt-2 text-xs leading-5 text-muted-foreground">
								Based on your current study trajectory and focus scores, you are
								on track to meet your semester goals. Maintaining this pace will
								likely result in an estimated GPA of{" "}
								<span className="font-semibold text-primary">3.8</span>.
							</p>
						</div>
					</div>
					<div className="mt-5 grid gap-3 sm:grid-cols-2">
						<div className="rounded-lg bg-muted/60 p-3">
							<p className="text-[10px] uppercase text-muted-foreground">
								Current status
							</p>
							<p className="mt-1 text-xl font-semibold">Ahead of Schedule</p>
						</div>
						<div className="rounded-lg bg-muted/60 p-3">
							<p className="text-[10px] uppercase text-muted-foreground">
								Recommended action
							</p>
							<p className="mt-1 text-xs font-semibold">
								Increase Physics focus time by 10%
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
