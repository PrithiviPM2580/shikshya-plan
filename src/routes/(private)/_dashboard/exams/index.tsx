import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowUpRight,
	BookOpen,
	CalendarDays,
	CheckCircle2,
	ChevronRight,
	Clock3,
	FileText,
	GraduationCap,
	MapPin,
	Plus,
	TrendingUp,
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

export const Route = createFileRoute("/(private)/_dashboard/exams/")({
	component: RouteComponent,
});

function RouteComponent() {
	const exams = [
		{
			type: "MIDTERM",
			subject: "Organic Chemistry",
			code: "CHM201",
			date: "Oct 24, 9:00 AM",
			location: "Science Hall, Room 302",
			readiness: 68,
			tone: "destructive",
		},
		{
			type: "FINAL",
			subject: "Data Structures",
			code: "CS300",
			date: "Nov 12, 1:00 PM",
			location: "Online Assessment",
			readiness: 42,
			tone: "primary",
		},
		{
			type: "QUIZ",
			subject: "Modern World Literature",
			code: "ENG305",
			date: "Nov 05, 10:30 AM",
			location: "Humanities Bldg, Room 104",
			readiness: 15,
			tone: "secondary",
		},
	];

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Academic Progression
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">
						Exams & readiness
					</h1>
				</div>
				<Button>
					<Plus /> Add Exam
				</Button>
			</section>

			<Card className="overflow-hidden rounded-xl border-0 bg-primary text-primary-foreground shadow-sm">
				<CardContent className="p-5 sm:p-7">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<Badge className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/15">
								Next big challenge
							</Badge>
							<h2 className="mt-4 text-lg font-bold">
								Organic Chemistry Midterm
							</h2>
							<p className="mt-2 max-w-xl text-xs leading-5 text-primary-foreground/75">
								Reaction mechanisms, stereochemistry, and spectroscopy. You're
								currently at 68% readiness based on completed study tasks.
							</p>
							<div className="mt-5 flex flex-wrap gap-2">
								<Button variant="secondary">
									<BookOpen /> Launch Study Plan
								</Button>
								<Button
									variant="outline"
									className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
								>
									View Syllabus
								</Button>
							</div>
						</div>
						<div className="grid grid-cols-3 divide-x divide-border/60 rounded-lg bg-primary-foreground/90 text-center text-primary shadow-sm">
							<div className="px-4 py-3">
								<p className="text-lg font-bold">12</p>
								<p className="text-[9px] uppercase text-muted-foreground">
									Days
								</p>
							</div>
							<div className="px-4 py-3">
								<p className="text-lg font-bold">08</p>
								<p className="text-[9px] uppercase text-muted-foreground">
									Hours
								</p>
							</div>
							<div className="px-4 py-3">
								<p className="text-lg font-bold">44</p>
								<p className="text-[9px] uppercase text-muted-foreground">
									Mins
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
				<main>
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center justify-between border-b border-border/60 px-4 py-4">
							<CardTitle className="text-sm">Scheduled Exams</CardTitle>
							<Button variant="link" size="sm" className="h-auto px-0 text-xs">
								Filter <ChevronRight />
							</Button>
						</CardHeader>
						<CardContent className="space-y-1 px-0 pb-2">
							{exams.map((exam) => (
								<div
									key={exam.code}
									className={`grid gap-4 border-l-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_120px] sm:items-center ${exam.tone === "destructive" ? "border-l-destructive" : exam.tone === "secondary" ? "border-l-secondary" : "border-l-primary"}`}
								>
									<div>
										<div className="flex flex-wrap items-center gap-2">
											<Badge variant="secondary" className="text-[9px]">
												{exam.type}
											</Badge>
											<span className="text-[10px] text-muted-foreground">
												<CalendarDays className="mr-1 inline size-3" />
												{exam.date}
											</span>
										</div>
										<p className="mt-2 text-xs font-bold">
											{exam.subject} ({exam.code})
										</p>
										<p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
											<MapPin className="size-3" />
											{exam.location}
										</p>
									</div>
									<div className="rounded-lg bg-muted/60 p-3">
										<div className="flex items-center justify-between text-[10px]">
											<span className="text-muted-foreground">Readiness</span>
											<span className="font-bold">{exam.readiness}%</span>
										</div>
										<Progress value={exam.readiness} className="mt-2 h-1.5" />
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</main>

				<aside className="space-y-4">
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center justify-between px-4 pb-2 pt-4">
							<CardTitle className="text-sm">Performance Trend</CardTitle>
							<TrendingUp className="size-4 text-primary" />
						</CardHeader>
						<CardContent className="px-4 pb-4">
							<p className="text-xs text-muted-foreground">Projected GPA</p>
							<p className="mt-1 text-xl font-bold text-primary">
								3.8{" "}
								<span className="text-xs font-medium text-emerald-600">
									↗ +0.2
								</span>
							</p>
							<div className="mt-5 flex h-20 items-end gap-2 border-b border-border/60 px-1">
								{[28, 36, 31, 58, 50, 74].map((height, index) => (
									<div
										key={index}
										className="flex-1 rounded-t-sm bg-primary/20"
										style={{ height: `${height}%` }}
									>
										<div
											className="h-full rounded-t-sm bg-primary"
											style={{
												height:
													index === 5 ? "100%" : index === 3 ? "60%" : "25%",
											}}
										/>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
					<Card className="rounded-xl border-0 bg-primary text-primary-foreground py-0 shadow-sm">
						<CardHeader className="px-4 pb-2 pt-4">
							<CardTitle className="flex items-center gap-2 text-sm">
								<GraduationCap className="size-4" /> Prep Resources
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1 px-4 pb-4">
							{[
								[FileText, "Past Papers Repository"],
								[BookOpen, "Flashcard Decks"],
								[CheckCircle2, "Study Groups"],
							].map(([Icon, label]) => {
								const ResourceIcon = Icon as typeof FileText;
								return (
									<Button
										key={label as string}
										variant="ghost"
										className="h-9 w-full justify-start gap-3 px-2 text-xs text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
									>
										<ResourceIcon className="size-4" />
										{label as string}
										<ArrowUpRight className="ml-auto size-3" />
									</Button>
								);
							})}
						</CardContent>
					</Card>
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardContent className="flex items-center gap-3 p-4">
							<div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Clock3 className="size-4" />
							</div>
							<div>
								<p className="text-xs font-semibold">Your exam week</p>
								<p className="text-[11px] text-muted-foreground">
									Keep two focused sessions per day.
								</p>
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
