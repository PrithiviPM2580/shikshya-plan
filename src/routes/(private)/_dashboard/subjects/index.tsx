import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	Calculator,
	CheckCircle2,
	Code2,
	Ellipsis,
	FileCheck2,
	FlaskConical,
	Grid2X2,
	List,
	Plus,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardContent } from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Progress } from "#/components/ui/progress.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";

export const Route = createFileRoute("/(private)/_dashboard/subjects/")({
	component: RouteComponent,
});

function RouteComponent() {
	const subjects = [
		{
			name: "Computer Fundamentals & Applications",
			code: "BCA101",
			credits: 3,
			tasks: 12,
			exams: 1,
			progress: 68,
			icon: BookOpen,
		},
		{
			name: "Programming in C",
			code: "BCA102",
			credits: 3,
			tasks: 8,
			exams: 1,
			progress: 85,
			icon: Code2,
		},
		{
			name: "Digital Logic",
			code: "BCA103",
			credits: 3,
			tasks: 5,
			exams: 1,
			progress: 42,
			icon: FlaskConical,
		},
		{
			name: "Mathematics I",
			code: "BCA104",
			credits: 3,
			tasks: 9,
			exams: 1,
			progress: 92,
			icon: Calculator,
		},
		{
			name: "Professional Communication & Ethics",
			code: "BCA105",
			credits: 3,
			tasks: 6,
			exams: 1,
			progress: 55,
			icon: FileCheck2,
		},
	];

	return (
		<div className="w-full space-y-6">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Library
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">
						Your Subjects
					</h1>
				</div>
				<Button className="w-full sm:w-auto">
					<Plus /> New Subject
				</Button>
			</section>

			<section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative w-full sm:w-64">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search subjects..." className="pl-9" />
					</div>
					<Button variant="outline" size="sm">
						<SlidersHorizontal /> Sort by: Recently Added
					</Button>
				</div>
				<div className="flex items-center justify-between gap-4">
					<Tabs defaultValue="active">
						<TabsList>
							<TabsTrigger value="active">Active</TabsTrigger>
							<TabsTrigger value="archived">Archived</TabsTrigger>
						</TabsList>
					</Tabs>
					<div className="hidden items-center gap-1 text-muted-foreground sm:flex">
						<Button variant="ghost" size="icon-sm" aria-label="Grid view">
							<Grid2X2 />
						</Button>
						<Button variant="ghost" size="icon-sm" aria-label="List view">
							<List />
						</Button>
					</div>
				</div>
			</section>

			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>
					Showing <strong className="text-foreground">{subjects.length}</strong>{" "}
					active subjects
				</span>
				<span className="hidden sm:inline">BCA · 1st Semester</span>
			</div>

			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{subjects.map((subject) => {
					const SubjectIcon = subject.icon;
					return (
						<Card
							key={subject.code}
							className="group rounded-xl border bg-card py-0 shadow-sm transition-shadow hover:shadow-md"
						>
							<CardContent className="flex h-full flex-col p-4">
								<div className="flex items-start justify-between gap-3">
									<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<SubjectIcon className="size-5" />
									</div>
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label={`More options for ${subject.name}`}
									>
										<Ellipsis />
									</Button>
								</div>
								<div className="mt-4 min-h-14">
									<h2 className="text-sm font-bold leading-5">
										{subject.name}
									</h2>
									<p className="mt-1 text-xs text-muted-foreground">
										{subject.code} <span className="px-1">·</span>{" "}
										{subject.credits} credits
									</p>
								</div>
								<div className="mt-4 grid grid-cols-2 gap-2">
									<div className="rounded-lg bg-muted/60 px-3 py-2">
										<div className="flex items-center gap-1.5 text-muted-foreground">
											<CheckCircle2 className="size-3.5" />
											<span className="text-[11px]">Tasks</span>
										</div>
										<p className="mt-1 text-sm font-bold">{subject.tasks}</p>
									</div>
									<div className="rounded-lg bg-muted/60 px-3 py-2">
										<div className="flex items-center gap-1.5 text-muted-foreground">
											<FileCheck2 className="size-3.5" />
											<span className="text-[11px]">Exams</span>
										</div>
										<p className="mt-1 text-sm font-bold">{subject.exams}</p>
									</div>
								</div>
								<div className="mt-auto pt-5">
									<div className="mb-2 flex items-center justify-between text-xs">
										<span className="text-muted-foreground">
											Syllabus mastery
										</span>
										<span className="font-bold text-primary">
											{subject.progress}%
										</span>
									</div>
									<Progress value={subject.progress} className="h-1.5" />
								</div>
							</CardContent>
						</Card>
					);
				})}
			</section>

			<div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
				<BookOpen className="size-4 text-primary" />
				<span>
					Add your remaining semester subjects to keep your study plan complete.
				</span>
				<Badge variant="secondary">5 of 6</Badge>
			</div>
		</div>
	);
}
