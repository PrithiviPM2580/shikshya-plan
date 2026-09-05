import { createFileRoute, useRouter } from "@tanstack/react-router";
import { BookOpen, Check, Pencil, Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import ConfirmDeleteButton from "#/components/shared/confirm-delete-button";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "#/components/ui/pagination";
import { getSessionOptions } from "#/features/sessions/server/options";
import {
	completeSession,
	createSession,
	deleteSession,
	getSessions,
	updateSession,
} from "#/features/sessions/server/sessions";

export const Route = createFileRoute("/(private)/_dashboard/sessions/")({
	loader: async () => ({
		sessions: await getSessions(),
		options: await getSessionOptions(),
	}),
	component: SessionsPage,
});

function SessionsPage() {
	const { sessions, options } = Route.useLoaderData();
	const router = useRouter();
	const [formOpen, setFormOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [subjectId, setSubjectId] = useState("");
	const [planId, setPlanId] = useState("");
	const [scheduledDate, setScheduledDate] = useState(
		new Date().toISOString().slice(0, 16),
	);
	const [durationMin, setDurationMin] = useState(30);
	const [notes, setNotes] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [page, setPage] = useState(1);
	const completed = sessions.filter((session) => session.completed);
	const pageSize = 8;
	const pageCount = Math.max(1, Math.ceil(sessions.length / pageSize));
	const currentPage = Math.min(page, pageCount);
	const paginatedSessions = sessions.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);
	const today = new Date().toDateString();
	const todayMinutes = completed
		.filter(
			(session) => new Date(session.scheduledDate).toDateString() === today,
		)
		.reduce((total, session) => total + session.durationMin, 0);

	function resetForm() {
		setFormOpen(false);
		setEditingId(null);
		setTitle("");
		setSubjectId("");
		setPlanId("");
		setScheduledDate(new Date().toISOString().slice(0, 16));
		setDurationMin(30);
		setNotes("");
	}
	function edit(session: (typeof sessions)[number]) {
		setEditingId(session.id);
		setFormOpen(true);
		setTitle(session.title);
		setSubjectId(session.subjectId ?? "");
		setPlanId(session.planId ?? "");
		setScheduledDate(
			new Date(session.scheduledDate).toISOString().slice(0, 16),
		);
		setDurationMin(session.durationMin);
		setNotes(session.notes ?? "");
	}
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSaving(true);
		try {
			const data = {
				title,
				subjectId: subjectId || null,
				planId: planId || null,
				scheduledDate: new Date(scheduledDate),
				durationMin,
				notes,
			};
			if (editingId) {
				await updateSession({ data: { id: editingId, ...data } });
				toast.success("Session updated");
			} else {
				await createSession({ data });
				toast.success("Session scheduled");
			}
			resetForm();
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save session",
			);
		} finally {
			setIsSaving(false);
		}
	}
	async function finish(id: string, minutes: number) {
		try {
			await completeSession({ data: { id, minutes } });
			await router.invalidate();
			toast.success("Session completed");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to complete session",
			);
		}
	}
	async function remove(id: string) {
		try {
			await deleteSession({ data: { id } });
			await router.invalidate();
			toast.success("Session deleted");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to delete session",
			);
		}
	}

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
						Schedule study time and track completed work.
					</p>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setFormOpen(true);
					}}
				>
					<Plus /> New Session
				</Button>
			</section>
			<section className="grid gap-4 md:grid-cols-3">
				<Stat
					label="Time today"
					value={`${Math.floor(todayMinutes / 60)}h ${todayMinutes % 60}m`}
				/>
				<Stat label="Completed sessions" value={String(completed.length)} />
				<Stat label="Total sessions" value={String(sessions.length)} />
			</section>
			{formOpen && (
				<form
					onSubmit={submit}
					className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2"
				>
					<Input
						required
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Session title"
					/>
					<select
						value={subjectId}
						onChange={(event) => setSubjectId(event.target.value)}
						className="h-9 rounded-md border border-input bg-background px-3 text-sm"
					>
						<option value="">No subject</option>
						{options.subjects.map((subject) => (
							<option key={subject.id} value={subject.id}>
								{subject.name}
							</option>
						))}
					</select>
					<select
						value={planId}
						onChange={(event) => setPlanId(event.target.value)}
						className="h-9 rounded-md border border-input bg-background px-3 text-sm"
					>
						<option value="">No study plan</option>
						{options.plans.map((plan) => (
							<option key={plan.id} value={plan.id}>
								{plan.title}
							</option>
						))}
					</select>
					<Input
						required
						type="datetime-local"
						value={scheduledDate}
						onChange={(event) => setScheduledDate(event.target.value)}
					/>
					<Input
						required
						type="number"
						min="1"
						max="720"
						value={durationMin}
						onChange={(event) => setDurationMin(Number(event.target.value))}
						placeholder="Duration in minutes"
					/>
					<Input
						value={notes}
						onChange={(event) => setNotes(event.target.value)}
						placeholder="Notes (optional)"
					/>
					<div className="flex gap-2">
						<Button type="submit" disabled={isSaving}>
							{isSaving
								? "Saving..."
								: editingId
									? "Save Session"
									: "Schedule Session"}
						</Button>
						<Button type="button" variant="outline" onClick={resetForm}>
							Cancel
						</Button>
					</div>
				</form>
			)}
			<section className="space-y-3">
				{paginatedSessions.map((session) => (
					<Card
						key={session.id}
						className={`rounded-xl border bg-card py-0 shadow-sm ${session.completed ? "opacity-70" : ""}`}
					>
						<CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<BookOpen className="size-5" />
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-2">
									<Badge variant="secondary">
										{session.subject?.name ?? "General"}
									</Badge>
									<Badge variant={session.completed ? "secondary" : "outline"}>
										{session.completed ? "Completed" : "Scheduled"}
									</Badge>
								</div>
								<h2
									className={`mt-2 text-sm font-bold ${session.completed ? "line-through" : ""}`}
								>
									{session.title}
								</h2>
								<p className="mt-1 text-xs text-muted-foreground">
									{new Date(session.scheduledDate).toLocaleString()} ·{" "}
									{session.durationMin} minutes
								</p>
								{session.notes && (
									<p className="mt-1 text-xs text-muted-foreground">
										{session.notes}
									</p>
								)}
							</div>
							<div className="flex gap-1">
								{!session.completed && (
									<Button
										size="icon-sm"
										variant="ghost"
										onClick={() => finish(session.id, session.durationMin)}
										aria-label={`Complete ${session.title}`}
									>
										<Check />
									</Button>
								)}
								<Button
									size="icon-sm"
									variant="ghost"
									onClick={() => edit(session)}
									aria-label={`Edit ${session.title}`}
								>
									<Pencil />
								</Button>
								<ConfirmDeleteButton
									itemLabel={session.title}
									onConfirm={() => remove(session.id)}
								/>
							</div>
						</CardContent>
					</Card>
				))}
				{sessions.length === 0 && (
					<p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
						No study sessions yet.
					</p>
				)}
			</section>
			{pageCount > 1 && (
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#sessions"
								aria-disabled={currentPage === 1}
								onClick={(event) => {
									event.preventDefault();
									if (currentPage > 1) setPage(currentPage - 1);
								}}
							/>
						</PaginationItem>
						<PaginationItem>
							<span className="px-3 text-xs text-muted-foreground">
								{currentPage} / {pageCount}
							</span>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext
								href="#sessions"
								aria-disabled={currentPage === pageCount}
								onClick={(event) => {
									event.preventDefault();
									if (currentPage < pageCount) setPage(currentPage + 1);
								}}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
function Stat({ label, value }: { label: string; value: string }) {
	return (
		<Card className="rounded-xl border bg-card py-0 shadow-sm">
			<CardContent className="p-4">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="mt-2 text-xl font-bold">{value}</p>
			</CardContent>
		</Card>
	);
}
