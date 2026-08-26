import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Clock3,
	Flag,
	MapPin,
	Plus,
} from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";

export const Route = createFileRoute("/(private)/_dashboard/calendar/")({
	component: RouteComponent,
});

function RouteComponent() {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const dates = [
		"27",
		"28",
		"29",
		"30",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
		"16",
		"17",
		"18",
		"19",
		"20",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"29",
		"30",
		"31",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
	];
	const eventMap: Record<string, { label: string; type: "study" | "exam" }[]> =
		{
			"2": [{ label: "Biology Ch. 4", type: "study" }],
			"4": [{ label: "Lab Report", type: "study" }],
			"6": [
				{ label: "Chemistry Midterm", type: "exam" },
				{ label: "Study Group", type: "study" },
			],
		};

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Calendar
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">
						Study schedule
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Manage your study schedule and upcoming milestones.
					</p>
				</div>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Tabs defaultValue="month">
						<TabsList>
							<TabsTrigger value="month">Month</TabsTrigger>
							<TabsTrigger value="week">Week</TabsTrigger>
							<TabsTrigger value="list">List</TabsTrigger>
						</TabsList>
					</Tabs>
					<Button>
						<Plus /> New Event
					</Button>
				</div>
			</section>

			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
				<Card className="overflow-hidden rounded-xl border bg-card py-0 shadow-sm">
					<CardHeader className="flex-row items-center justify-between border-b border-border/60 px-5 py-4">
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Previous month"
							>
								<ArrowLeft />
							</Button>
							<CardTitle className="min-w-32 text-center text-sm">
								October 2026
							</CardTitle>
							<Button variant="ghost" size="icon-sm" aria-label="Next month">
								<ArrowRight />
							</Button>
						</div>
						<Button variant="outline" size="sm">
							Today
						</Button>
					</CardHeader>
					<CardContent className="p-0">
						<div className="grid grid-cols-7 border-b border-border/60">
							{days.map((day) => (
								<div
									key={day}
									className="py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
								>
									{day}
								</div>
							))}
						</div>
						<div className="grid grid-cols-7">
							{dates.map((date, index) => {
								const isCurrentMonth = index >= 4 && index < 35;
								const isSelected = date === "6" && index === 12;
								const events = isCurrentMonth ? eventMap[date] : undefined;
								return (
									<div
										key={`${date}-${index}`}
										className={`min-h-24 border-b border-r border-border/50 p-2 last:border-r-0 sm:min-h-28 ${!isCurrentMonth ? "bg-muted/20 text-muted-foreground/50" : ""} ${isSelected ? "bg-primary/5 ring-1 ring-inset ring-primary" : ""}`}
									>
										<div
											className={`ml-auto flex size-6 items-center justify-center rounded-full text-xs ${isSelected ? "bg-primary font-bold text-primary-foreground" : ""}`}
										>
											{date}
										</div>
										<div className="mt-2 space-y-1">
											{events?.map((event) => (
												<div
													key={event.label}
													className={`truncate rounded px-1.5 py-1 text-[10px] font-medium ${event.type === "exam" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
												>
													{event.label}
												</div>
											))}
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>

				<aside className="space-y-5">
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="px-4 pb-2 pt-4">
							<CardTitle className="text-sm">Friday, Oct 6</CardTitle>
							<p className="text-xs text-muted-foreground">
								3 events scheduled
							</p>
						</CardHeader>
						<CardContent className="space-y-4 px-4 pb-5">
							<div className="relative border-l border-border pl-4">
								<span className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-card bg-destructive" />
								<p className="text-[10px] font-semibold text-destructive">
									09:00 AM - 11:30 AM
								</p>
								<div className="mt-2 rounded-lg bg-muted/50 p-3">
									<p className="text-xs font-bold">Chemistry Midterm</p>
									<p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
										<MapPin className="size-3" /> Science Hall, Room 302
									</p>
								</div>
							</div>
							<div className="relative border-l border-border pl-4">
								<span className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-card bg-primary" />
								<p className="text-[10px] font-semibold text-primary">
									01:00 PM
								</p>
								<div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
									<p className="flex items-center gap-1 text-[10px] font-semibold uppercase">
										<Flag className="size-3" /> Plan milestone
									</p>
									<p className="mt-1 text-xs font-bold">
										Finish Org Chem Ch. 1-4
									</p>
									<div className="mt-2 h-1 rounded-full bg-primary/15">
										<div className="h-full w-4/5 rounded-full bg-primary" />
									</div>
								</div>
							</div>
							<div className="relative border-l border-border pl-4">
								<span className="absolute -left-1.5 top-1 size-3 rounded-full border-2 border-card bg-primary" />
								<p className="text-[10px] font-semibold text-primary">
									03:30 PM - 05:00 PM
								</p>
								<div className="mt-2 rounded-lg bg-muted/50 p-3">
									<p className="text-xs font-bold">Library Study Group</p>
									<p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
										<Clock3 className="size-3" /> 3 Pomodoros planned
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="px-4 pb-2 pt-4">
							<CardTitle className="text-sm">Upcoming Deadlines</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 px-4 pb-4">
							<div className="flex items-center gap-2 text-xs">
								<span className="size-2 rounded-full bg-destructive" />
								<span className="flex-1">Physics Lab Report</span>
								<span className="text-[10px] text-muted-foreground">
									Oct 12
								</span>
							</div>
							<div className="flex items-center gap-2 text-xs">
								<span className="size-2 rounded-full bg-primary" />
								<span className="flex-1">Math Assignment 4</span>
								<span className="text-[10px] text-muted-foreground">
									Oct 15
								</span>
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
