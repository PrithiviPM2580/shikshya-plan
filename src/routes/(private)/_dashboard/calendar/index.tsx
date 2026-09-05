import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Clock3, Flag, Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { getCalendarData } from "#/features/calendar/server/calendar";
import { createExam } from "#/features/exams/server/exams";
import { getSessionOptions } from "#/features/sessions/server/options";
import { createSession } from "#/features/sessions/server/sessions";
import { createTask } from "#/features/tasks/server/tasks";

export const Route = createFileRoute("/(private)/_dashboard/calendar/")({
	loader: async () => {
		const [calendar, options] = await Promise.all([
			getCalendarData(),
			getSessionOptions(),
		]);
		return { ...calendar, options };
	},
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
	const router = useRouter();
	const [month, setMonth] = useState(() => new Date());
	const [selectedDate, setSelectedDate] = useState(() => new Date());
	const [eventOpen, setEventOpen] = useState(false);
	const [eventType, setEventType] = useState<"task" | "session" | "exam">(
		"task",
	);
	const [title, setTitle] = useState("");
	const [eventDate, setEventDate] = useState("");
	const [subjectId, setSubjectId] = useState("");
	const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
	const [durationMin, setDurationMin] = useState("30");
	const [syllabus, setSyllabus] = useState("");
	const [saving, setSaving] = useState(false);
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

	function openEventForm() {
		const date = new Date(selectedDate);
		date.setHours(9, 0, 0, 0);
		setEventDate(toDateTimeLocal(date));
		setEventOpen(true);
	}

	function resetEventForm() {
		setEventOpen(false);
		setTitle("");
		setSubjectId("");
		setPriority("MEDIUM");
		setDurationMin("30");
		setSyllabus("");
	}

	async function submitEvent(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		try {
			const date = new Date(eventDate);
			if (eventType === "task") {
				await createTask({
					data: {
						title,
						description: "",
						subjectId: subjectId || null,
						priority,
						dueDate: date,
					},
				});
			} else if (eventType === "session") {
				await createSession({
					data: {
						title,
						subjectId: subjectId || null,
						planId: null,
						scheduledDate: date,
						durationMin: Number(durationMin),
						notes: "",
					},
				});
			} else {
				await createExam({
					data: {
						title,
						subjectId: subjectId || null,
						examDate: date,
						syllabus,
						readinessPercentage: 0,
					},
				});
			}
			resetEventForm();
			await router.invalidate();
			toast.success(
				`${eventType[0].toUpperCase()}${eventType.slice(1)} created`,
			);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to create event",
			);
		} finally {
			setSaving(false);
		}
	}

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
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => setSelectedDate(new Date())}>
						Today
					</Button>
					<Button onClick={openEventForm}>
						<Plus /> New Event
					</Button>
				</div>
			</section>
			{eventOpen && (
				<form
					onSubmit={submitEvent}
					className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2"
				>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Event type</span>
						<select
							value={eventType}
							onChange={(event) =>
								setEventType(event.target.value as typeof eventType)
							}
							className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
						>
							<option value="task">Task</option>
							<option value="session">Study session</option>
							<option value="exam">Exam</option>
						</select>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Title</span>
						<Input
							required
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							placeholder="What is scheduled?"
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Date and time</span>
						<Input
							required
							type="datetime-local"
							value={eventDate}
							onChange={(event) => setEventDate(event.target.value)}
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Subject</span>
						<select
							value={subjectId}
							onChange={(event) => setSubjectId(event.target.value)}
							className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
						>
							<option value="">No subject</option>
							{data.options.subjects.map((subject) => (
								<option key={subject.id} value={subject.id}>
									{subject.name}
								</option>
							))}
						</select>
					</label>
					{eventType === "task" && (
						<label className="space-y-1 text-sm">
							<span className="font-medium">Priority</span>
							<select
								value={priority}
								onChange={(event) =>
									setPriority(event.target.value as typeof priority)
								}
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
							>
								<option value="LOW">Low</option>
								<option value="MEDIUM">Medium</option>
								<option value="HIGH">High</option>
							</select>
						</label>
					)}
					{eventType === "session" && (
						<label className="space-y-1 text-sm">
							<span className="font-medium">Duration (minutes)</span>
							<Input
								required
								type="number"
								min="1"
								max="720"
								value={durationMin}
								onChange={(event) => setDurationMin(event.target.value)}
							/>
						</label>
					)}
					{eventType === "exam" && (
						<label className="space-y-1 text-sm">
							<span className="font-medium">Syllabus or topics</span>
							<Input
								value={syllabus}
								onChange={(event) => setSyllabus(event.target.value)}
							/>
						</label>
					)}
					<div className="flex gap-2 md:col-span-2">
						<Button type="submit" disabled={saving}>
							{saving ? "Creating..." : "Create Event"}
						</Button>
						<Button type="button" variant="outline" onClick={resetEventForm}>
							Cancel
						</Button>
					</div>
				</form>
			)}
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

function toDateTimeLocal(date: Date) {
	const offset = date.getTimezoneOffset();
	return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}
