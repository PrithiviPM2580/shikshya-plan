import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	Check,
	Clock3,
	Focus,
	Pause,
	Play,
	Square,
	TimerReset,
} from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Progress } from "#/components/ui/progress.tsx";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table.tsx";

export const Route = createFileRoute("/(private)/_dashboard/sessions/")({
	component: RouteComponent,
});

function RouteComponent() {
	const recentSessions = [
		{
			subject: "Linear Algebra",
			detail: "Eigenvalue practice",
			duration: "1h 30m",
			focus: 92,
			date: "Today",
			time: "09:00 AM",
			status: "Completed",
		},
		{
			subject: "Physics Lab",
			detail: "Report write-up",
			duration: "45m",
			focus: 78,
			date: "Yesterday",
			time: "02:15 PM",
			status: "Interrupted",
		},
		{
			subject: "World History",
			detail: "Chapter 4 Reading",
			duration: "2h 15m",
			focus: 88,
			date: "Yesterday",
			time: "10:00 AM",
			status: "Completed",
		},
	];

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Execution Hub
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">
						Study Sessions
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Track your active study time and review past performance.
					</p>
				</div>
				<Button className="w-full sm:w-auto">
					<Play /> Start New Session
				</Button>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardContent className="p-4">
						<div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
							<span>TOTAL TIME (TODAY)</span>
							<Clock3 className="size-4 text-primary" />
						</div>
						<p className="mt-3 text-lg font-bold">4h 30m</p>
						<p className="mt-1 text-xs text-emerald-600">
							↗ +45m from yesterday
						</p>
					</CardContent>
				</Card>
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardContent className="p-4">
						<div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
							<span>AVG FOCUS SCORE</span>
							<Focus className="size-4 text-primary" />
						</div>
						<p className="mt-3 text-lg font-bold">88%</p>
						<p className="mt-1 text-xs text-emerald-600">↗ +2% this week</p>
					</CardContent>
				</Card>
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardContent className="p-4">
						<div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
							<span>SESSIONS COMPLETED</span>
							<Check className="size-4 text-primary" />
						</div>
						<p className="mt-3 text-lg font-bold">12</p>
						<p className="mt-1 text-xs text-muted-foreground">This week</p>
					</CardContent>
				</Card>
			</section>

			<Card className="rounded-xl border-0 bg-primary text-primary-foreground shadow-sm">
				<CardContent className="p-5 sm:p-7">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<Badge className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/15">
								<span className="mr-1 size-1.5 rounded-full bg-primary-foreground" />{" "}
								SESSION ACTIVE
							</Badge>
							<p className="mt-5 text-sm font-bold">
								Data Structures & Algorithms
							</p>
							<p className="mt-1 text-xs text-primary-foreground/75">
								Module 4: Graph Traversals
							</p>
						</div>
						<div className="flex flex-col items-center gap-4 sm:flex-row">
							<div className="flex size-28 items-center justify-center rounded-full border-10 border-primary-foreground/20 border-t-primary-foreground text-sm font-bold">
								48:46
							</div>
							<div className="flex gap-2">
								<Button
									variant="secondary"
									size="icon"
									aria-label="Pause session"
								>
									<Pause />
								</Button>
								<Button variant="destructive">
									<Square /> End Session
								</Button>
							</div>
						</div>
					</div>
					<div className="mt-6">
						<div className="flex justify-between text-[11px] text-primary-foreground/75">
							<span>Session progress</span>
							<span>65%</span>
						</div>
						<Progress
							value={65}
							className="mt-2 bg-primary-foreground/20 [&>div]:bg-primary-foreground"
						/>
					</div>
				</CardContent>
			</Card>

			<Card className="rounded-xl border bg-card py-0 shadow-sm">
				<CardHeader className="flex-row items-center justify-between border-b border-border/60 px-4 py-4">
					<CardTitle className="text-sm">Recent Sessions</CardTitle>
					<Button variant="link" size="sm" className="h-auto px-0 text-xs">
						View all
					</Button>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Subject</TableHead>
									<TableHead>Duration</TableHead>
									<TableHead>Focus</TableHead>
									<TableHead>Date & Time</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentSessions.map((session) => (
									<TableRow key={`${session.subject}-${session.time}`}>
										<TableCell>
											<div className="flex items-center gap-3">
												<span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
													<BookOpen className="size-4" />
												</span>
												<div>
													<p className="text-xs font-semibold">
														{session.subject}
													</p>
													<p className="text-[11px] text-muted-foreground">
														{session.detail}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell className="text-xs">
											{session.duration}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<span className="h-1.5 w-7 rounded-full bg-primary/20">
													<span
														className="block h-full rounded-full bg-primary"
														style={{ width: `${session.focus}%` }}
													/>
												</span>
												<span className="text-xs text-primary">
													{session.focus}%
												</span>
											</div>
										</TableCell>
										<TableCell>
											<p className="text-xs">{session.date}</p>
											<p className="text-[11px] text-muted-foreground">
												{session.time}
											</p>
										</TableCell>
										<TableCell>
											<Badge
												variant={
													session.status === "Completed"
														? "secondary"
														: "destructive"
												}
											>
												{session.status === "Completed" ? (
													<Check />
												) : (
													<TimerReset />
												)}{" "}
												{session.status}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
