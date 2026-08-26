import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	CheckCircle2,
	Clock3,
	Ellipsis,
	Flame,
	Goal,
	Plus,
	Rocket,
	Target,
	Trophy,
} from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import { Progress } from "#/components/ui/progress.tsx";

export const Route = createFileRoute("/(private)/_dashboard/goals/")({
	component: RouteComponent,
});

function RouteComponent() {
	const goals = [
		{
			category: "Academic",
			title: "Maintain 3.8 GPA",
			detail: "Focus on core subjects: Physics and Advanced Math.",
			milestones: [
				"Aim in Physics Midterm",
				"Complete Math Project",
				"Ace Final Exams",
			],
			checked: [true, false, false],
			progress: 33,
			date: "Dec 15, 2026",
		},
		{
			category: "Skill-based",
			title: "Learn Python Data Analysis",
			detail: "Master Pandas and Matplotlib for research data.",
			milestones: [
				"Finish Basics Course",
				"Build First Chart",
				"Analyze CSV Dataset",
			],
			checked: [true, true, false],
			progress: 66,
			date: "Nov 30, 2026",
		},
	];

	return (
		<div className="w-full space-y-5">
			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
				<main className="space-y-5">
					<section className="flex flex-col gap-4 rounded-xl bg-muted/50 p-5 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
								Your ambitions
							</p>
							<h1 className="mt-1 text-2xl font-bold tracking-tight">
								Goals that move you forward
							</h1>
							<p className="mt-1 text-sm text-muted-foreground">
								Set your sights, track your milestones, and achieve greatness.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-2 text-center">
							<div className="rounded-lg bg-background px-5 py-3">
								<p className="text-lg font-bold">12</p>
								<p className="text-[10px] uppercase text-muted-foreground">
									Active goals
								</p>
							</div>
							<div className="rounded-lg bg-primary/10 px-5 py-3">
								<p className="text-lg font-bold text-primary">4</p>
								<p className="text-[10px] uppercase text-primary">Achieved</p>
							</div>
						</div>
					</section>

					<Card className="rounded-xl border-0 bg-primary text-primary-foreground shadow-sm">
						<CardContent className="p-5 sm:p-7">
							<div className="flex flex-col gap-5 sm:flex-row sm:items-center">
								<div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
									<Rocket className="size-7" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/75">
										Current focus
									</p>
									<h2 className="mt-1 text-base font-bold">
										Mastering Differential Equations
									</h2>
									<p className="mt-1 text-xs leading-5 text-primary-foreground/75">
										Consistent practice required. Target: 90% in upcoming
										Midterm.
									</p>
									<div className="mt-4 flex items-center gap-3">
										<Progress
											value={65}
											className="bg-primary-foreground/20 [&>div]:bg-primary-foreground"
										/>
										<span className="whitespace-nowrap text-xs">65%</span>
									</div>
									<div className="mt-1 flex justify-between text-[11px] text-primary-foreground/70">
										<span>Completed</span>
										<span>14 Days Left</span>
									</div>
								</div>
								<Button variant="secondary" className="shrink-0">
									<Clock3 /> Log Session
								</Button>
							</div>
						</CardContent>
					</Card>

					<section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex gap-2 overflow-x-auto">
							<Button variant="default" size="sm">
								All Goals
							</Button>
							<Button variant="secondary" size="sm">
								Academic
							</Button>
							<Button variant="secondary" size="sm">
								Skill-based
							</Button>
							<Button variant="secondary" size="sm">
								Habit
							</Button>
						</div>
						<Button className="w-full sm:w-auto">
							<Plus /> New Goal
						</Button>
					</section>

					<section className="grid gap-4 md:grid-cols-2">
						{goals.map((goal) => (
							<Card
								key={goal.title}
								className="rounded-xl border bg-card py-0 shadow-sm"
							>
								<CardContent className="p-4">
									<div className="flex items-start justify-between gap-3">
										<Badge
											variant="secondary"
											className="uppercase text-[10px]"
										>
											{goal.category}
										</Badge>
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label={`More options for ${goal.title}`}
										>
											<Ellipsis />
										</Button>
									</div>
									<h2 className="mt-3 text-sm font-bold">{goal.title}</h2>
									<p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">
										{goal.detail}
									</p>
									<div className="mt-4 rounded-lg bg-muted/70 p-3">
										<p className="mb-2 text-xs font-medium">Milestones</p>
										<div className="space-y-2">
											{goal.milestones.map((milestone, index) => (
												<label
													key={milestone}
													htmlFor={`${goal.title}-${index}`}
													className="flex items-center gap-2 text-xs text-muted-foreground"
												>
													<Checkbox
														id={`${goal.title}-${index}`}
														checked={goal.checked[index]}
													/>{" "}
													<span
														className={
															goal.checked[index] ? "line-through" : ""
														}
													>
														{milestone}
													</span>
												</label>
											))}
										</div>
									</div>
									<div className="mt-4 flex items-center justify-between text-xs">
										<span className="text-muted-foreground">Progress</span>
										<span className="font-semibold text-primary">
											{goal.progress}%
										</span>
									</div>
									<Progress value={goal.progress} className="mt-2 h-1.5" />
									<p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
										<Target className="size-3" /> {goal.date}
									</p>
								</CardContent>
							</Card>
						))}
					</section>
				</main>

				<aside className="space-y-4">
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="px-4 pb-2 pt-4">
							<CardTitle className="text-sm">Success Board</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 px-4 pb-5">
							<p className="text-xs text-muted-foreground">Recent wins</p>
							<div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
								<div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Trophy className="size-4" />
								</div>
								<div>
									<p className="text-xs font-semibold">100 Pomodoros</p>
									<p className="text-[11px] text-muted-foreground">
										Completed yesterday
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
								<div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
									<BookOpen className="size-4" />
								</div>
								<div>
									<p className="text-xs font-semibold">Read 5 Books</p>
									<p className="text-[11px] text-muted-foreground">
										Completed last week
									</p>
								</div>
							</div>
							<div>
								<p className="mb-2 text-xs font-medium text-muted-foreground">
									Badges
								</p>
								<div className="grid grid-cols-3 gap-2">
									<div className="rounded-lg bg-primary/10 p-3 text-center text-primary">
										<Flame className="mx-auto size-5" />
										<p className="mt-1 text-[9px]">7 Day Streak</p>
									</div>
									<div className="rounded-lg bg-muted p-3 text-center text-muted-foreground">
										<BookOpen className="mx-auto size-5" />
										<p className="mt-1 text-[9px]">Book Worm</p>
									</div>
									<div className="rounded-lg bg-muted p-3 text-center text-muted-foreground">
										<Goal className="mx-auto size-5" />
										<p className="mt-1 text-[9px]">Early Bird</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="rounded-xl border-0 bg-primary/10 py-0 shadow-sm">
						<CardContent className="flex gap-3 p-4">
							<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
							<div>
								<p className="text-xs font-semibold text-primary">Keep going</p>
								<p className="mt-1 text-[11px] leading-4 text-muted-foreground">
									Small, consistent progress compounds into remarkable results.
								</p>
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
