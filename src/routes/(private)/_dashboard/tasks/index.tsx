import { createFileRoute } from "@tanstack/react-router";
import {
	CalendarDays,
	CheckCircle2,
	Clock3,
	Ellipsis,
	Flag,
	Plus,
	Search,
	Timer,
} from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Progress } from "#/components/ui/progress.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";

export const Route = createFileRoute("/(private)/_dashboard/tasks/")({
	component: RouteComponent,
});

function RouteComponent() {
	const tasks = [
		{
			subject: "CHEM 201",
			title: "Organic Chemistry Mechanism Review",
			detail: "Complete practice problems chapter 14.",
			due: "Due Today",
			progress: 40,
			completed: "2/5 Subtasks",
			tone: "destructive",
		},
		{
			subject: "CS 304",
			title: "Data Structures Lab 4",
			detail: "Implement Red-Black Tree insertion.",
			due: "Tomorrow, 11:59 PM",
			progress: 80,
			completed: "80%",
			tone: "warning",
		},
		{
			subject: "HIST 101",
			title: "Read Chapter 5 & 6",
			detail: "The French Revolution impacts.",
			due: "Friday, 5:00 PM",
			progress: 0,
			completed: "Not Started",
			tone: "primary",
		},
		{
			subject: "MATH 210",
			title: "Calculus Problem Set 3",
			detail: "Review integration techniques.",
			due: "Completed",
			progress: 100,
			completed: "Completed",
			tone: "muted",
		},
	];

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Academic Tasks
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">Your tasks</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage your assignments and study goals.
					</p>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row">
					<div className="relative w-full sm:w-56">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search tasks..." className="pl-9" />
					</div>
					<Button>
						<Plus /> Create Task
					</Button>
				</div>
			</section>

			<section className="flex flex-col gap-3 border-b border-border/60 pb-0 sm:flex-row sm:items-center sm:justify-between">
				<Tabs defaultValue="all">
					<TabsList className="w-full justify-start bg-transparent p-0 sm:w-auto">
						<TabsTrigger value="all">All Tasks</TabsTrigger>
						<TabsTrigger value="soon">
							Due Soon{" "}
							<Badge
								variant="destructive"
								className="ml-1 size-4 justify-center p-0 text-[9px]"
							>
								3
							</Badge>
						</TabsTrigger>
						<TabsTrigger value="priority">High Priority</TabsTrigger>
						<TabsTrigger value="completed">Completed</TabsTrigger>
					</TabsList>
				</Tabs>
				<Button variant="outline" size="sm" className="mb-2 w-full sm:w-auto">
					<CalendarDays /> Filter by date
				</Button>
			</section>

			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
				<main className="grid gap-4 sm:grid-cols-2">
					{tasks.map((task) => (
						<Card
							key={task.title}
							className={`rounded-xl border bg-card py-0 shadow-sm ${task.tone === "destructive" ? "border-l-3 border-l-destructive" : task.tone === "warning" ? "border-l-3 border-l-secondary" : task.tone === "primary" ? "border-l-3 border-l-primary" : "border-l-3 border-l-muted-foreground/30"}`}
						>
							<CardContent className="p-4">
								<div className="flex items-center justify-between gap-2">
									<Badge variant="secondary" className="text-[10px]">
										{task.subject}
									</Badge>
									<span
										className={`text-xs font-semibold ${task.tone === "destructive" ? "text-destructive" : task.tone === "muted" ? "text-muted-foreground" : "text-primary"}`}
									>
										{task.tone === "destructive" ? (
											<Flag className="mr-1 inline size-3" />
										) : null}
										{task.due}
									</span>
								</div>
								<div className="mt-3 flex items-start justify-between gap-2">
									<div>
										<h2
											className={`text-sm font-bold leading-5 ${task.progress === 100 ? "text-muted-foreground line-through" : ""}`}
										>
											{task.title}
										</h2>
										<p className="mt-1 text-xs leading-5 text-muted-foreground">
											{task.detail}
										</p>
									</div>
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label={`More options for ${task.title}`}
									>
										<Ellipsis />
									</Button>
								</div>
								<div className="mt-5 flex items-center justify-between text-[11px]">
									<span className="text-muted-foreground">Progress</span>
									<span className="font-semibold">{task.completed}</span>
								</div>
								<Progress value={task.progress} className="mt-2 h-1.5" />
							</CardContent>
						</Card>
					))}
				</main>

				<aside className="space-y-4">
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center gap-2 px-4 pb-2 pt-4">
							<Clock3 className="size-4 text-primary" />
							<CardTitle className="text-sm">Upcoming</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 px-4 pb-5">
							<div className="flex gap-3">
								<div className="flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-destructive/10 text-destructive">
									<span className="text-[10px] font-semibold">Oct</span>
									<span className="text-sm font-bold">24</span>
								</div>
								<div>
									<p className="text-xs font-semibold">Chem 201 Midterm</p>
									<p className="text-[11px] text-muted-foreground">Today</p>
								</div>
							</div>
							<div className="flex gap-3">
								<div className="flex size-9 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-muted-foreground">
									<span className="text-[10px] font-semibold">Oct</span>
									<span className="text-sm font-bold">26</span>
								</div>
								<div>
									<p className="text-xs font-semibold">Hist 101 Essay Draft</p>
									<p className="text-[11px] text-muted-foreground">In 2 days</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="rounded-xl border-0 bg-primary/10 py-0 shadow-sm">
						<CardContent className="p-4">
							<div className="flex items-center gap-2">
								<Timer className="size-4 text-primary" />
								<p className="text-xs font-semibold text-primary">
									Tip of the Day
								</p>
							</div>
							<p className="mt-2 text-xs italic leading-5 text-muted-foreground">
								Break down large tasks into 25-minute Pomodoro sessions to
								maintain focus and avoid burnout.
							</p>
						</CardContent>
					</Card>
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="px-4 pb-2 pt-4">
							<CardTitle className="text-sm">Task summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 px-4 pb-4">
							<div className="flex justify-between text-xs">
								<span className="text-muted-foreground">Completed</span>
								<span className="font-semibold">1 of 4</span>
							</div>
							<Progress value={25} className="h-1.5" />
							<div className="flex items-center gap-2 text-[11px] text-muted-foreground">
								<CheckCircle2 className="size-3.5 text-primary" /> Keep your
								daily streak going.
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
