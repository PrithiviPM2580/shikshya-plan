import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CalendarClock, Clock3, Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { getSessionOptions } from "#/features/sessions/server/options";
import {
	createSession,
	getSessions,
} from "#/features/sessions/server/sessions";

export const Route = createFileRoute("/(private)/_dashboard/scheduler/")({
	loader: async () => ({
		sessions: await getSessions(),
		options: await getSessionOptions(),
	}),
	component: SchedulerPage,
});

function SchedulerPage() {
	const { sessions, options } = Route.useLoaderData();
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [subjectId, setSubjectId] = useState("");
	const [planId, setPlanId] = useState("");
	const [scheduledDate, setScheduledDate] = useState(
		new Date(Date.now() + 3600000).toISOString().slice(0, 16),
	);
	const [durationMin, setDurationMin] = useState(30);
	const [saving, setSaving] = useState(false);
	const upcoming = sessions
		.filter(
			(session) =>
				!session.completed && new Date(session.scheduledDate) >= new Date(),
		)
		.slice(0, 8);
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		try {
			await createSession({
				data: {
					title,
					subjectId: subjectId || null,
					planId: planId || null,
					scheduledDate: new Date(scheduledDate),
					durationMin,
					notes: "",
				},
			});
			setTitle("");
			toast.success("Study session scheduled");
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to schedule session",
			);
		} finally {
			setSaving(false);
		}
	}
	return (
		<div className="w-full space-y-5">
			<section className="border-b border-border pb-5">
				<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
					Planning
				</p>
				<h1 className="mt-1 text-2xl font-bold tracking-tight">
					Build your schedule
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Turn your study goals into focused sessions.
				</p>
			</section>
			<div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardHeader className="border-b border-border/60 px-5 py-4">
						<CardTitle className="flex items-center gap-2 text-sm">
							<CalendarClock className="size-4 text-primary" /> Schedule a study
							session
						</CardTitle>
					</CardHeader>
					<CardContent className="p-5">
						<form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
							<label className="space-y-1 text-sm sm:col-span-2">
								<span className="font-medium">Session title</span>
								<Input
									required
									value={title}
									onChange={(event) => setTitle(event.target.value)}
									placeholder="e.g. Review data structures"
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
									{options.subjects.map((subject) => (
										<option key={subject.id} value={subject.id}>
											{subject.name}
										</option>
									))}
								</select>
							</label>
							<label className="space-y-1 text-sm">
								<span className="font-medium">Study plan</span>
								<select
									value={planId}
									onChange={(event) => setPlanId(event.target.value)}
									className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
								>
									<option value="">No plan</option>
									{options.plans.map((plan) => (
										<option key={plan.id} value={plan.id}>
											{plan.title}
										</option>
									))}
								</select>
							</label>
							<label className="space-y-1 text-sm">
								<span className="font-medium">Date and time</span>
								<Input
									required
									type="datetime-local"
									value={scheduledDate}
									onChange={(event) => setScheduledDate(event.target.value)}
								/>
							</label>
							<label className="space-y-1 text-sm">
								<span className="font-medium">Duration in minutes</span>
								<Input
									required
									type="number"
									min="1"
									max="720"
									value={durationMin}
									onChange={(event) =>
										setDurationMin(Number(event.target.value))
									}
								/>
							</label>
							<Button type="submit" disabled={saving} className="sm:col-span-2">
								<Plus />
								{saving ? "Scheduling..." : "Schedule session"}
							</Button>
						</form>
					</CardContent>
				</Card>
				<Card className="rounded-xl border bg-card py-0 shadow-sm">
					<CardHeader className="px-4 pb-3 pt-4">
						<CardTitle className="text-sm">Upcoming sessions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 px-4 pb-5">
						{upcoming.map((session) => (
							<div key={session.id} className="rounded-lg bg-muted/60 p-3">
								<div className="flex items-center gap-2">
									<Clock3 className="size-3.5 text-primary" />
									<p className="min-w-0 flex-1 truncate text-xs font-semibold">
										{session.title}
									</p>
									<Badge variant="outline">{session.durationMin}m</Badge>
								</div>
								<p className="mt-1 text-[11px] text-muted-foreground">
									{session.subject?.name ?? "General"} ·{" "}
									{new Date(session.scheduledDate).toLocaleString()}
								</p>
							</div>
						))}
						{upcoming.length === 0 && (
							<p className="py-6 text-center text-xs text-muted-foreground">
								No upcoming sessions.
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
