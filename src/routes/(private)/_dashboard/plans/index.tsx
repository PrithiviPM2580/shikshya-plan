import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	Check,
	Ellipsis,
	GripVertical,
	Lightbulb,
	Plus,
	RefreshCw,
	Target,
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

export const Route = createFileRoute("/(private)/_dashboard/plans/")({
	component: RouteComponent,
});

function RouteComponent() {
	const plans = [
		{
			name: "Finals Prep - Spring '24",
			dates: "May 1 - May 25",
			status: "Active",
			progress: 65,
			next: "Data Structures Review",
		},
		{
			name: "GRE Quant Sprint",
			dates: "Jun 10 - Jul 10",
			status: "Upcoming",
			progress: 0,
			next: "Starts in 3 weeks",
		},
	];
	const subjects = [
		{
			name: "Organic Chemistry",
			detail: "3 modules selected",
			priority: "Med",
		},
		{ name: "Calculus II", detail: "All modules selected", priority: "High" },
	];

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Study Plans
					</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Design and track your academic sprints.
					</p>
				</div>
				<Button className="w-full sm:w-auto">
					<Plus /> Create New Plan
				</Button>
			</section>

			<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
				<main className="space-y-5">
					<section className="grid gap-4 md:grid-cols-2">
						{plans.map((plan) => (
							<Card
								key={plan.name}
								className="rounded-xl border bg-card py-0 shadow-sm"
							>
								<CardContent className="p-4">
									<div className="flex items-start justify-between gap-3">
										<Badge
											variant={
												plan.status === "Active" ? "default" : "secondary"
											}
										>
											{plan.status}
										</Badge>
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label={`More options for ${plan.name}`}
										>
											<Ellipsis />
										</Button>
									</div>
									<h2 className="mt-3 text-sm font-bold">{plan.name}</h2>
									<p className="mt-1 text-xs text-muted-foreground">
										{plan.dates}
									</p>
									<div className="mt-4 flex items-center justify-between text-[11px]">
										<span className="text-muted-foreground">
											Overall progress
										</span>
										<span className="font-semibold">{plan.progress}%</span>
									</div>
									<Progress value={plan.progress} className="mt-2 h-1.5" />
									<div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-xs">
										<span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
											<Target className="size-3.5" />
										</span>
										<div>
											<p className="text-[10px] text-muted-foreground">
												Up next
											</p>
											<p className="font-semibold">{plan.next}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</section>

					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center gap-3 border-b border-border/60 px-5 py-4">
							<span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
								1
							</span>
							<CardTitle className="text-sm">Goal Setting</CardTitle>
						</CardHeader>
						<CardContent className="p-5">
							<div className="grid gap-4 sm:grid-cols-2">
								<label
									htmlFor="plan-name"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									PLAN NAME
									<Input id="plan-name" placeholder="e.g. Midterm Mastery" />
								</label>
								<label
									htmlFor="target-date"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									TARGET DATE
									<Input id="target-date" type="date" />
								</label>
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
							<div className="flex items-center gap-3">
								<span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
									2
								</span>
								<CardTitle className="text-sm">Subject Allocation</CardTitle>
							</div>
							<Button variant="link" size="sm" className="h-auto px-0 text-xs">
								<Plus /> Add Subject
							</Button>
						</CardHeader>
						<CardContent className="space-y-2 p-5">
							{subjects.map((subject) => (
								<div
									key={subject.name}
									className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"
								>
									<GripVertical className="size-4 shrink-0 text-muted-foreground" />
									<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
										<BookOpen className="size-4" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-xs font-semibold">{subject.name}</p>
										<p className="text-[11px] text-muted-foreground">
											{subject.detail}
										</p>
									</div>
									<div className="flex items-center gap-1 rounded-full border border-border bg-background p-0.5 text-[10px]">
										<span className="px-1.5 text-muted-foreground">Low</span>
										<span
											className={`rounded-full px-1.5 py-1 font-semibold ${subject.priority === "High" ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}
										>
											{subject.priority}
										</span>
										<span className="px-1.5 text-muted-foreground">High</span>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
							<div className="flex items-center gap-3">
								<span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
									3
								</span>
								<CardTitle className="text-sm">Smart Schedule</CardTitle>
							</div>
							<Button variant="link" size="sm" className="h-auto px-0 text-xs">
								<RefreshCw /> Regenerate
							</Button>
						</CardHeader>
						<CardContent className="p-5">
							<div className="grid grid-cols-5 gap-1 rounded-lg bg-muted/60 p-3">
								{["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
									<div key={day} className="space-y-2 text-center">
										<p className="text-[10px] font-medium text-muted-foreground">
											{day}
										</p>
										<div className="flex h-20 flex-col justify-end gap-1">
											{index !== 3 && (
												<>
													<span className="h-12 rounded-sm bg-primary/15" />
													<span className="h-6 rounded-sm bg-primary" />
												</>
											)}
										</div>
										<p className="text-[10px] text-muted-foreground">
											{index === 3 ? "Rest" : `${index === 1 ? "2.5" : "3"}h`}
										</p>
									</div>
								))}
							</div>
							<div className="mt-5 flex justify-end">
								<Button>
									<Check /> Save & Start Plan
								</Button>
							</div>
						</CardContent>
					</Card>
				</main>

				<aside className="space-y-4">
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="px-4 pb-2 pt-4">
							<CardTitle className="text-sm">Plan Milestones</CardTitle>
						</CardHeader>
						<CardContent className="px-4 pb-4">
							<p className="text-xs text-muted-foreground">
								Key checkpoints to keep you on track.
							</p>
							<div className="mt-4 space-y-4 border-l border-border pl-4">
								{[
									["Finish Org Chemistry", "Expected: May 5", true],
									["Practice Exam 1", "Expected: May 12", false],
									["All Review Complete", "Expected: May 20", false],
								].map(([title, date, complete]) => (
									<div key={title as string} className="relative">
										<span
											className={`absolute -left-5.25 top-0.5 flex size-2.5 rounded-full border-2 border-card ${complete ? "bg-primary" : "bg-muted-foreground/30"}`}
										/>
										<p className="text-[11px] font-semibold">
											{title as string}
										</p>
										<p className="mt-0.5 text-[10px] text-muted-foreground">
											{date as string}
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
					<Card className="rounded-xl border-0 bg-primary/10 py-0 shadow-sm">
						<CardContent className="flex gap-3 p-4">
							<Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
							<div>
								<p className="text-xs font-semibold text-primary">Pro Tip</p>
								<p className="mt-1 text-[11px] leading-4 text-muted-foreground">
									Distributing high-intensity subjects across different days
									improves retention.
								</p>
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
