import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CalendarDays, Check, Pencil, Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import ConfirmDeleteButton from "#/components/shared/confirm-delete-button";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Progress } from "#/components/ui/progress";
import {
	createExam,
	deleteExam,
	getExams,
	toggleExam,
	updateExam,
} from "#/features/exams/server/exams";
import { getExamOptions } from "#/features/exams/server/options";

export const Route = createFileRoute("/(private)/_dashboard/exams/")({
	loader: async () => ({
		exams: await getExams(),
		subjects: await getExamOptions(),
	}),
	component: ExamsPage,
});

function ExamsPage() {
	const { exams, subjects } = Route.useLoaderData();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [subjectId, setSubjectId] = useState("");
	const [examDate, setExamDate] = useState("");
	const [syllabus, setSyllabus] = useState("");
	const [readinessPercentage, setReadinessPercentage] = useState("0");
	const [saving, setSaving] = useState(false);
	const upcoming = exams.filter(
		(exam) => !exam.completed && new Date(exam.examDate) >= new Date(),
	);
	const nextExam = upcoming[0];

	function reset() {
		setOpen(false);
		setEditingId(null);
		setTitle("");
		setSubjectId("");
		setExamDate("");
		setSyllabus("");
		setReadinessPercentage("0");
	}
	function edit(exam: (typeof exams)[number]) {
		setOpen(true);
		setEditingId(exam.id);
		setTitle(exam.title);
		setSubjectId(exam.subjectId ?? "");
		setExamDate(new Date(exam.examDate).toISOString().slice(0, 16));
		setSyllabus(exam.syllabus ?? "");
		setReadinessPercentage(String(exam.readinessPercentage));
	}
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		try {
			const data = {
				title,
				subjectId: subjectId || null,
				examDate: new Date(examDate),
				syllabus,
				readinessPercentage: Number(readinessPercentage),
			};
			if (editingId) {
				await updateExam({ data: { id: editingId, ...data } });
				toast.success("Exam updated");
			} else {
				await createExam({ data });
				toast.success("Exam scheduled");
			}
			reset();
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save exam",
			);
		} finally {
			setSaving(false);
		}
	}
	async function toggle(id: string, completed: boolean) {
		try {
			await toggleExam({ data: { id, completed: !completed } });
			await router.invalidate();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update exam",
			);
		}
	}
	async function remove(id: string) {
		try {
			await deleteExam({ data: { id } });
			await router.invalidate();
			toast.success("Exam deleted");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to delete exam",
			);
		}
	}
	const countdown = nextExam
		? Math.max(
				0,
				Math.ceil(
					(new Date(nextExam.examDate).getTime() - Date.now()) / 86400000,
				),
			)
		: 0;

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
				<Button
					onClick={() => {
						reset();
						setOpen(true);
					}}
				>
					<Plus /> Add Exam
				</Button>
			</section>
			<Card className="rounded-xl border-0 bg-primary text-primary-foreground shadow-sm">
				<CardContent className="p-5">
					<p className="text-xs uppercase tracking-widest text-primary-foreground/70">
						Next exam
					</p>
					<h2 className="mt-3 text-lg font-bold">
						{nextExam?.title ?? "No upcoming exams"}
					</h2>
					<p className="mt-1 text-sm text-primary-foreground/75">
						{nextExam
							? `${nextExam.subject?.name ?? "General"} · ${countdown} day${countdown === 1 ? "" : "s"} remaining`
							: "Add an exam to start tracking readiness."}
					</p>
				</CardContent>
			</Card>
			<section className="grid gap-3 sm:grid-cols-3">
				<Stat label="Upcoming" value={String(upcoming.length)} />
				<Stat
					label="Completed"
					value={String(exams.filter((exam) => exam.completed).length)}
				/>
				<Stat label="Total exams" value={String(exams.length)} />
			</section>
			{open && (
				<form
					onSubmit={submit}
					className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2"
				>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Exam title</span>
						<Input
							required
							value={title}
							onChange={(event) => setTitle(event.target.value)}
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
							{subjects.map((subject) => (
								<option key={subject.id} value={subject.id}>
									{subject.name}
								</option>
							))}
						</select>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Exam date and time</span>
						<Input
							required
							type="datetime-local"
							value={examDate}
							onChange={(event) => setExamDate(event.target.value)}
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Syllabus or topics (optional)</span>
						<Input
							value={syllabus}
							onChange={(event) => setSyllabus(event.target.value)}
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Readiness percentage</span>
						<Input
							type="number"
							min="0"
							max="100"
							value={readinessPercentage}
							onChange={(event) => setReadinessPercentage(event.target.value)}
						/>
					</label>
					<div className="flex gap-2">
						<Button type="submit" disabled={saving}>
							{saving ? "Saving..." : editingId ? "Save Exam" : "Schedule Exam"}
						</Button>
						<Button type="button" variant="outline" onClick={reset}>
							Cancel
						</Button>
					</div>
				</form>
			)}
			<section className="space-y-3">
				{exams.map((exam) => (
					<Card
						key={exam.id}
						className={`rounded-xl border bg-card py-0 shadow-sm ${exam.completed ? "opacity-70" : ""}`}
					>
						<CardContent className="flex items-center gap-3 p-4">
							<button
								type="button"
								onClick={() => toggle(exam.id, exam.completed)}
								className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${exam.completed ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}
								aria-label={`${exam.completed ? "Reopen" : "Complete"} ${exam.title}`}
							>
								{exam.completed && <Check className="size-3" />}
							</button>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary">
										{exam.subject?.name ?? "General"}
									</Badge>
									<Badge variant={exam.completed ? "secondary" : "outline"}>
										{exam.completed ? "Completed" : "Scheduled"}
									</Badge>
								</div>
								<h2
									className={`mt-2 text-sm font-bold ${exam.completed ? "line-through" : ""}`}
								>
									{exam.title}
								</h2>
								<p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
									<CalendarDays className="size-3.5" />
									{new Date(exam.examDate).toLocaleString()}
								</p>
								{exam.syllabus && (
									<p className="mt-1 text-xs text-muted-foreground">
										{exam.syllabus}
									</p>
								)}
								<div className="mt-3 max-w-sm">
									<div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
										<span>Readiness</span>
										<span>{exam.readinessPercentage}%</span>
									</div>
									<Progress
										value={exam.readinessPercentage}
										className="h-1.5"
									/>
								</div>
							</div>
							<div className="flex gap-1">
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => edit(exam)}
									aria-label={`Edit ${exam.title}`}
								>
									<Pencil />
								</Button>
								<ConfirmDeleteButton
									itemLabel={exam.title}
									onConfirm={() => remove(exam.id)}
								/>
							</div>
						</CardContent>
					</Card>
				))}
				{exams.length === 0 && (
					<p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
						No exams scheduled yet.
					</p>
				)}
			</section>
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
