import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Clock3, Flag } from "lucide-react";
import { useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { getCalendarData } from "#/features/calendar/server/calendar";

export const Route = createFileRoute("/(private)/_dashboard/calendar/")({
	loader: () => getCalendarData(),
	component: CalendarPage,
});

type CalendarEvent = {
	id: string;
	label: string;
	detail: string;
	date: Date;
	type: "task" | "session" | "exam";
	completed: boolean;
};

function CalendarPage() {
	const data = Route.useLoaderData();
	const [month, setMonth] = useState(() => new Date());
	const [selectedDate, setSelectedDate] = useState(() => new Date());
	const events: CalendarEvent[] = [
		...data.tasks.map((task) => ({
			id: task.id,
			label: task.title,
			detail: task.subject?.name ?? "Task",
			date: new Date(task.dueDate!),
			type: "task" as const,
			completed: task.completed,
		})),
		...data.sessions.map((session) => ({
			id: session.id,
			label: session.title,
			detail: `${session.subject?.name ?? "Study"} · ${session.durationMin} min`,
			date: new Date(session.scheduledDate),
			type: "session" as const,
			completed: session.completed,
		})),
		...data.exams.map((exam) => ({
			id: exam.id,
			label: exam.title,
			detail: exam.subject?.name ?? "Exam",
			date: new Date(exam.examDate),
			type: "exam" as const,
			completed: exam.completed,
		})),
	];
	const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
	const gridStart = new Date(firstDay);
	gridStart.setDate(1 - firstDay.getDay());
	const days = Array.from({ length: 42 }, (_, index) => {
		const date = new Date(gridStart);
		date.setDate(gridStart.getDate() + index);
		return date;
	});
	const dateKey = (date: Date) =>
		`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
	const selectedEvents = events
		.filter((event) => dateKey(event.date) === dateKey(selectedDate))
		.sort((a, b) => a.date.getTime() - b.date.getTime());
	const monthEvents = (date: Date) =>
		events.filter((event) => dateKey(event.date) === dateKey(date));
	function moveMonth(amount: number) {
		setMonth(
			(current) =>
				new Date(current.getFullYear(), current.getMonth() + amount, 1),
		);
	}
	const isToday = (date: Date) => dateKey(date) === dateKey(new Date());

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Calendar
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">
						Study schedule
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Tasks, sessions, and exams in one view.
					</p>
				</div>
				<Button onClick={() => setSelectedDate(new Date())}>Today</Button>
			</section>
			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
				<Card className="overflow-hidden rounded-xl border bg-card py-0 shadow-sm">
					<CardHeader className="flex-row items-center justify-between border-b border-border/60 px-5 py-4">
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => moveMonth(-1)}
								aria-label="Previous month"
							>
								<ArrowLeft />
							</Button>
							<CardTitle className="min-w-40 text-center text-sm">
								{month.toLocaleDateString(undefined, {
									month: "long",
									year: "numeric",
								})}
							</CardTitle>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => moveMonth(1)}
								aria-label="Next month"
							>
								<ArrowRight />
							</Button>
						</div>
						<Badge variant="secondary">{events.length} events</Badge>
					</CardHeader>
					<CardContent className="p-0">
						<div className="grid grid-cols-7 border-b border-border/60">
							{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
								<div
									key={day}
									className="py-3 text-center text-[10px] font-semibold uppercase text-muted-foreground"
								>
									{day}
								</div>
							))}
						</div>
						<div className="grid grid-cols-7">
							{days.map((date) => {
								const dayEvents = monthEvents(date);
								const inMonth = date.getMonth() === month.getMonth();
								const selected = dateKey(date) === dateKey(selectedDate);
								return (
									<button
										type="button"
										key={date.toISOString()}
										onClick={() => setSelectedDate(date)}
										className={`min-h-24 border-b border-r border-border/50 p-2 text-left align-top ${!inMonth ? "bg-muted/20 text-muted-foreground/50" : ""} ${selected ? "bg-primary/5 ring-1 ring-inset ring-primary" : ""}`}
									>
										<span
											className={`flex size-6 items-center justify-center rounded-full text-xs ${isToday(date) ? "bg-primary font-bold text-primary-foreground" : ""}`}
										>
											{date.getDate()}
										</span>
										<div className="mt-2 space-y-1">
											{dayEvents.slice(0, 3).map((event) => (
												<span
													key={event.id}
													className={`block truncate rounded px-1.5 py-1 text-[10px] font-medium ${event.type === "exam" ? "bg-destructive/10 text-destructive" : event.completed ? "bg-muted text-muted-foreground line-through" : "bg-primary/10 text-primary"}`}
												>
													{event.label}
												</span>
											))}
											{dayEvents.length > 3 && (
												<span className="text-[10px] text-muted-foreground">
													+{dayEvents.length - 3} more
												</span>
											)}
										</div>
									</button>
								);
							})}
						</div>
					</CardContent>
				</Card>
				<aside>
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="px-4 pb-2 pt-4">
							<CardTitle className="text-sm">
								{selectedDate.toLocaleDateString(undefined, {
									weekday: "long",
									month: "short",
									day: "numeric",
								})}
							</CardTitle>
							<p className="text-xs text-muted-foreground">
								{selectedEvents.length} event
								{selectedEvents.length === 1 ? "" : "s"} scheduled
							</p>
						</CardHeader>
						<CardContent className="space-y-3 px-4 pb-5">
							{selectedEvents.map((event) => (
								<div key={event.id} className="rounded-lg bg-muted/50 p-3">
									<div className="flex items-center gap-2">
										{event.type === "exam" ? (
											<Flag className="size-3.5 text-destructive" />
										) : event.type === "task" ? (
											<Check className="size-3.5 text-primary" />
										) : (
											<Clock3 className="size-3.5 text-primary" />
										)}
										<p className="min-w-0 flex-1 truncate text-xs font-semibold">
											{event.label}
										</p>
									</div>
									<p className="mt-1 text-[11px] text-muted-foreground">
										{event.detail} ·{" "}
										{event.date.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>
							))}
							{selectedEvents.length === 0 && (
								<p className="py-6 text-center text-xs text-muted-foreground">
									Nothing scheduled for this day.
								</p>
							)}
						</CardContent>
					</Card>
					<Card className="mt-4 rounded-xl border bg-card py-0 shadow-sm">
						<CardContent className="space-y-2 p-4 text-xs">
							<div className="flex items-center gap-2">
								<span className="size-2 rounded-full bg-primary" />
								Study sessions and tasks
							</div>
							<div className="flex items-center gap-2">
								<span className="size-2 rounded-full bg-destructive" />
								Exams
							</div>
							<div className="flex items-center gap-2">
								<span className="size-2 rounded-full bg-muted-foreground" />
								Completed items
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
