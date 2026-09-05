import { createFileRoute } from "@tanstack/react-router";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { generateExamInsight } from "#/features/ai/server/exam-insight";
import { generateQuiz } from "#/features/ai/server/quiz";
import { createSmartTask } from "#/features/ai/server/smart-task";
import {
	generateStudyPlan,
	saveGeneratedStudyPlan,
} from "#/features/ai/server/study-plan";
import { generateTaskBreakdown } from "#/features/ai/server/task-breakdown";
import { askTutor } from "#/features/ai/server/tutor";
import type {
	GeneratedExamInsight,
	GeneratedQuiz,
	GeneratedStudyPlan,
	GeneratedTaskBreakdown,
	GeneratedTutorResponse,
} from "#/features/ai/validation";
import { getExams } from "#/features/exams/server/exams";
import { getSubjects } from "#/features/subjects/server/subjects";

export const Route = createFileRoute("/(private)/_dashboard/ai/")({
	loader: async () => {
		const [subjects, exams] = await Promise.all([getSubjects(), getExams()]);
		return { subjects, exams };
	},
	component: AiPage,
});

function AiPage() {
	const { subjects, exams } = Route.useLoaderData();
	const [focus, setFocus] = useState("");
	const [days, setDays] = useState("7");
	const [plan, setPlan] = useState<GeneratedStudyPlan | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [subjectId, setSubjectId] = useState("");
	const [selectedTaskKeys, setSelectedTaskKeys] = useState<string[]>([]);
	const [breakdownGoal, setBreakdownGoal] = useState("");
	const [breakdown, setBreakdown] = useState<GeneratedTaskBreakdown | null>(
		null,
	);
	const [breakdownLoading, setBreakdownLoading] = useState(false);
	const [selectedBreakdownTasks, setSelectedBreakdownTasks] = useState<
		number[]
	>([]);
	const [quizTopic, setQuizTopic] = useState("");
	const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
	const [quizLoading, setQuizLoading] = useState(false);
	const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
	const [examId, setExamId] = useState("");
	const [examInsight, setExamInsight] = useState<GeneratedExamInsight | null>(
		null,
	);
	const [examInsightLoading, setExamInsightLoading] = useState(false);
	const [smartTaskRequest, setSmartTaskRequest] = useState("");
	const [smartTaskLoading, setSmartTaskLoading] = useState(false);
	const [tutorQuestion, setTutorQuestion] = useState("");
	const [tutorSubject, setTutorSubject] = useState("");
	const [tutorResponse, setTutorResponse] =
		useState<GeneratedTutorResponse | null>(null);
	const [tutorLoading, setTutorLoading] = useState(false);

	async function createPlan(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		try {
			const result = await generateStudyPlan({
				data: { focus, days: Number(days) },
			});
			setPlan(result);
			setSelectedTaskKeys(
				result.days.flatMap((day, dayIndex) =>
					day.tasks.map((_, taskIndex) => `${dayIndex}-${taskIndex}`),
				),
			);
			toast.success("AI study plan generated");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to generate a study plan",
			);
		} finally {
			setLoading(false);
		}
	}

	function taskKey(dayIndex: number, taskIndex: number) {
		return `${dayIndex}-${taskIndex}`;
	}

	function toggleTask(key: string) {
		setSelectedTaskKeys((current) =>
			current.includes(key)
				? current.filter((item) => item !== key)
				: [...current, key],
		);
	}

	async function saveTasks() {
		if (!plan || selectedTaskKeys.length === 0) {
			toast.error("Select at least one task to save");
			return;
		}
		setSaving(true);
		try {
			const result = await saveGeneratedStudyPlan({
				data: {
					plan,
					selectedTaskKeys,
					subjectId: subjectId || null,
				},
			});
			toast.success(
				`${result.count} task${result.count === 1 ? "" : "s"} saved`,
			);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save tasks",
			);
		} finally {
			setSaving(false);
		}
	}

	async function createBreakdown(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setBreakdownLoading(true);
		try {
			const result = await generateTaskBreakdown({
				data: { goal: breakdownGoal, subjectId: subjectId || null },
			});
			setBreakdown(result);
			setSelectedBreakdownTasks(result.tasks.map((_, index) => index));
			toast.success("AI task breakdown generated");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to break down goal",
			);
		} finally {
			setBreakdownLoading(false);
		}
	}

	async function saveBreakdownTasks() {
		if (!breakdown || selectedBreakdownTasks.length === 0) return;
		const plan: GeneratedStudyPlan = {
			title: breakdown.goal,
			overview: breakdown.overview,
			days: [
				{
					day: "Today",
					focus: breakdown.goal,
					tasks: breakdown.tasks,
				},
			],
		};
		setSaving(true);
		try {
			const result = await saveGeneratedStudyPlan({
				data: {
					plan,
					selectedTaskKeys: selectedBreakdownTasks.map((index) => `0-${index}`),
					subjectId: subjectId || null,
				},
			});
			toast.success(
				`${result.count} task${result.count === 1 ? "" : "s"} saved`,
			);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save tasks",
			);
		} finally {
			setSaving(false);
		}
	}

	async function createExamInsight(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!examId) return;
		setExamInsightLoading(true);
		try {
			const result = await generateExamInsight({ data: { examId } });
			setExamInsight(result);
			toast.success("Exam insight generated");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to analyze exam",
			);
		} finally {
			setExamInsightLoading(false);
		}
	}

	async function createQuiz(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setQuizLoading(true);
		try {
			const result = await generateQuiz({
				data: { topic: quizTopic, questionCount: 5 },
			});
			setQuiz(result);
			setQuizAnswers({});
			toast.success("Practice quiz generated");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to generate quiz",
			);
		} finally {
			setQuizLoading(false);
		}
	}

	async function createSmartTaskFromText(
		event: React.FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();
		setSmartTaskLoading(true);
		try {
			const task = await createSmartTask({
				data: { request: smartTaskRequest },
			});
			toast.success(`Task created: ${task.title}`);
			setSmartTaskRequest("");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to create smart task",
			);
		} finally {
			setSmartTaskLoading(false);
		}
	}

	async function askAiTutor(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setTutorLoading(true);
		try {
			const result = await askTutor({
				data: {
					question: tutorQuestion,
					subject: tutorSubject || undefined,
				},
			});
			setTutorResponse(result);
			toast.success("Tutor explanation generated");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to answer question",
			);
		} finally {
			setTutorLoading(false);
		}
	}

	return (
		<div className="w-full space-y-5">
			<section className="border-b border-border pb-5">
				<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
					<Sparkles className="size-3.5" /> AI study coach
				</p>
				<h1 className="mt-1 text-2xl font-bold tracking-tight">
					Build a focused study plan
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Generate a practical schedule from your subjects, profile, and
					upcoming exams.
				</p>
			</section>

			<Card className="rounded-xl border bg-card py-0 shadow-sm">
				<CardHeader className="px-5 pb-2 pt-5">
					<CardTitle className="text-sm">Ask your AI tutor</CardTitle>
					<p className="text-xs text-muted-foreground">
						Get a clear explanation, example, and follow-up questions for any
						study topic.
					</p>
				</CardHeader>
				<CardContent className="space-y-4 px-5 pb-5">
					<form
						onSubmit={askAiTutor}
						className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:items-end"
					>
						<label className="space-y-2 text-xs font-medium">
							Question
							<Input
								required
								value={tutorQuestion}
								onChange={(event) => setTutorQuestion(event.target.value)}
								placeholder="e.g. Why does database normalization reduce redundancy?"
							/>
						</label>
						<label className="space-y-2 text-xs font-medium">
							Subject (optional)
							<select
								value={tutorSubject}
								onChange={(event) => setTutorSubject(event.target.value)}
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
							>
								<option value="">General</option>
								{subjects.map((subject) => (
									<option key={subject.id} value={subject.name}>
										{subject.name}
									</option>
								))}
							</select>
						</label>
						<Button type="submit" disabled={tutorLoading}>
							{tutorLoading ? <Loader2 className="animate-spin" /> : <Brain />}
							{tutorLoading ? "Thinking..." : "Ask tutor"}
						</Button>
					</form>
					{tutorResponse && (
						<div className="grid gap-4 rounded-lg bg-muted/50 p-4 md:grid-cols-[minmax(0,1.4fr)_minmax(220px,1fr)]">
							<div className="space-y-3">
								<div>
									<p className="text-xs font-semibold">Explanation</p>
									<p className="mt-1 text-sm leading-6">
										{tutorResponse.answer}
									</p>
								</div>
								<div>
									<p className="text-xs font-semibold">Example</p>
									<p className="mt-1 text-xs leading-5 text-muted-foreground">
										{tutorResponse.example}
									</p>
								</div>
							</div>
							<div className="space-y-3">
								<div>
									<p className="text-xs font-semibold">Key points</p>
									<ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
										{tutorResponse.keyPoints.map((point) => (
											<li key={point}>{point}</li>
										))}
									</ul>
								</div>
								<div>
									<p className="text-xs font-semibold">Try next</p>
									<ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
										{tutorResponse.followUpQuestions.map((question) => (
											<li key={question}>{question}</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
			<Card className="rounded-xl border bg-card py-0 shadow-sm">
				<CardContent className="p-5">
					<form
						onSubmit={createPlan}
						className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_auto] md:items-end"
					>
						<label className="space-y-2 text-sm font-medium">
							What should the plan focus on?
							<Input
								value={focus}
								onChange={(event) => setFocus(event.target.value)}
								placeholder="e.g. Prepare for my nearest exam"
							/>
						</label>
						<label className="space-y-2 text-sm font-medium">
							Plan length
							<select
								value={days}
								onChange={(event) => setDays(event.target.value)}
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
							>
								<option value="3">3 days</option>
								<option value="5">5 days</option>
								<option value="7">7 days</option>
							</select>
						</label>
						<Button type="submit" disabled={loading}>
							{loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
							{loading ? "Planning..." : "Generate plan"}
						</Button>
					</form>
				</CardContent>
			</Card>
			<Card className="rounded-xl border bg-card py-0 shadow-sm">
				<CardHeader className="px-5 pb-2 pt-5">
					<CardTitle className="text-sm">Create a task with AI</CardTitle>
					<p className="text-xs text-muted-foreground">
						Describe a task naturally and AI will set its title, date, priority,
						and subject.
					</p>
				</CardHeader>
				<CardContent className="px-5 pb-5">
					<form
						onSubmit={createSmartTaskFromText}
						className="flex flex-col gap-3 sm:flex-row"
					>
						<Input
							required
							value={smartTaskRequest}
							onChange={(event) => setSmartTaskRequest(event.target.value)}
							placeholder="e.g. Finish chapter 3 of DBMS tomorrow, high priority"
						/>
						<Button type="submit" disabled={smartTaskLoading}>
							{smartTaskLoading ? (
								<Loader2 className="animate-spin" />
							) : (
								<Brain />
							)}
							{smartTaskLoading ? "Creating..." : "Create task"}
						</Button>
					</form>
				</CardContent>
			</Card>
			<Card className="rounded-xl border bg-card py-0 shadow-sm">
				<CardHeader className="px-5 pb-2 pt-5">
					<CardTitle className="text-sm">Exam readiness insight</CardTitle>
					<p className="text-xs text-muted-foreground">
						Get targeted advice from your current readiness and study activity.
					</p>
				</CardHeader>
				<CardContent className="space-y-4 px-5 pb-5">
					<form
						onSubmit={createExamInsight}
						className="flex flex-col gap-3 sm:flex-row"
					>
						<select
							value={examId}
							onChange={(event) => setExamId(event.target.value)}
							className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm"
							required
						>
							<option value="">Choose an upcoming exam</option>
							{exams
								.filter((exam) => !exam.completed)
								.map((exam) => (
									<option key={exam.id} value={exam.id}>
										{exam.title}
									</option>
								))}
						</select>
						<Button
							type="submit"
							disabled={examInsightLoading || exams.length === 0}
						>
							{examInsightLoading ? (
								<Loader2 className="animate-spin" />
							) : (
								<Brain />
							)}
							{examInsightLoading ? "Analyzing..." : "Analyze exam"}
						</Button>
					</form>
					{examInsight && (
						<div className="space-y-3 rounded-lg bg-muted/50 p-4">
							<div className="flex items-center gap-2 text-xs">
								<Badge
									variant={
										examInsight.priority === "HIGH" ? "destructive" : "outline"
									}
								>
									{examInsight.priority} priority
								</Badge>
								<span className="text-muted-foreground">
									{examInsight.readiness}% ready · {examInsight.daysRemaining}{" "}
									days left
								</span>
							</div>
							<p className="text-sm font-medium">
								{examInsight.readinessSummary}
							</p>
							<div className="grid gap-3 sm:grid-cols-2">
								<div>
									<p className="text-xs font-semibold">Next actions</p>
									<ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
										{examInsight.nextActions.map((action) => (
											<li key={action}>{action}</li>
										))}
									</ul>
								</div>
								<div>
									<p className="text-xs font-semibold">Focus topics</p>
									<ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
										{examInsight.focusTopics.map((topic) => (
											<li key={topic}>{topic}</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
			<Card className="rounded-xl border bg-card py-0 shadow-sm">
				<CardHeader className="px-5 pb-2 pt-5">
					<CardTitle className="text-sm">Practice quiz</CardTitle>
					<p className="text-xs text-muted-foreground">
						Generate multiple-choice questions for active revision.
					</p>
				</CardHeader>
				<CardContent className="space-y-4 px-5 pb-5">
					<form
						onSubmit={createQuiz}
						className="flex flex-col gap-3 sm:flex-row"
					>
						<Input
							required
							value={quizTopic}
							onChange={(event) => setQuizTopic(event.target.value)}
							placeholder="e.g. Database normalization"
						/>
						<Button type="submit" disabled={quizLoading}>
							{quizLoading ? <Loader2 className="animate-spin" /> : <Brain />}
							{quizLoading ? "Creating..." : "Create quiz"}
						</Button>
					</form>
					{quiz && (
						<div className="space-y-4 rounded-lg bg-muted/50 p-4">
							<h2 className="text-sm font-bold">{quiz.title}</h2>
							{quiz.questions.map((item, questionIndex) => {
								const answer = quizAnswers[questionIndex];
								const answered = answer !== undefined;
								return (
									<div
										key={item.question}
										className="space-y-2 rounded-lg bg-background p-3"
									>
										<p className="text-xs font-semibold">
											{questionIndex + 1}. {item.question}
										</p>
										<div className="grid gap-2 sm:grid-cols-2">
											{item.options.map((option, optionIndex) => (
												<button
													key={option}
													type="button"
													onClick={() =>
														setQuizAnswers((current) => ({
															...current,
															[questionIndex]: optionIndex,
														}))
													}
													className={`rounded-md border p-2 text-left text-xs ${answered && optionIndex === item.correctOption ? "border-primary bg-primary/10" : answered && optionIndex === answer ? "border-destructive bg-destructive/10" : "border-border hover:border-primary"}`}
												>
													{option}
												</button>
											))}
										</div>
										{answered && (
											<p className="text-[11px] text-muted-foreground">
												{item.explanation}
											</p>
										)}
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>
			<Card className="rounded-xl border bg-card py-0 shadow-sm">
				<CardHeader className="px-5 pb-2 pt-5">
					<CardTitle className="text-sm">Break down a large goal</CardTitle>
					<p className="text-xs text-muted-foreground">
						Turn one assignment or exam goal into smaller tasks.
					</p>
				</CardHeader>
				<CardContent className="space-y-4 px-5 pb-5">
					<form
						onSubmit={createBreakdown}
						className="flex flex-col gap-3 sm:flex-row"
					>
						<Input
							required
							value={breakdownGoal}
							onChange={(event) => setBreakdownGoal(event.target.value)}
							placeholder="e.g. Finish my database systems assignment"
						/>
						<Button type="submit" disabled={breakdownLoading}>
							{breakdownLoading ? (
								<Loader2 className="animate-spin" />
							) : (
								<Brain />
							)}
							{breakdownLoading ? "Breaking down..." : "Break it down"}
						</Button>
					</form>
					{breakdown && (
						<div className="space-y-3 rounded-lg bg-muted/50 p-3">
							<p className="text-xs text-muted-foreground">
								{breakdown.overview}
							</p>
							{breakdown.tasks.map((task, index) => (
								<label
									key={`${task.title}-${index}`}
									className="flex items-center gap-3 rounded-md bg-background p-3"
								>
									<input
										type="checkbox"
										checked={selectedBreakdownTasks.includes(index)}
										onChange={() =>
											setSelectedBreakdownTasks((current) =>
												current.includes(index)
													? current.filter((item) => item !== index)
													: [...current, index],
											)
										}
									/>
									<span className="min-w-0 flex-1 text-xs font-semibold">
										{task.title}
									</span>
									<span className="text-[11px] text-muted-foreground">
										{task.durationMinutes}m
									</span>
								</label>
							))}
							<Button
								onClick={saveBreakdownTasks}
								disabled={saving || selectedBreakdownTasks.length === 0}
							>
								{saving
									? "Saving..."
									: `Save ${selectedBreakdownTasks.length} tasks`}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{plan ? (
				<section className="space-y-4">
					<Card className="rounded-xl border bg-primary text-primary-foreground py-0 shadow-sm">
						<CardContent className="p-5">
							<div className="flex items-center gap-2">
								<Brain className="size-5" />
								<Badge className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/20">
									AI generated
								</Badge>
							</div>
							<h2 className="mt-4 text-xl font-bold">{plan.title}</h2>
							<p className="mt-1 text-sm text-primary-foreground/80">
								{plan.overview}
							</p>
						</CardContent>
					</Card>
					<div>
						<h2 className="text-sm font-bold">Generated schedule</h2>
						<p className="mt-1 text-xs text-muted-foreground">
							Your overview is above. The daily study tasks are listed below.
						</p>
					</div>
					<div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-end sm:justify-between">
						<label className="space-y-2 text-sm font-medium">
							Save tasks under a subject
							<select
								value={subjectId}
								onChange={(event) => setSubjectId(event.target.value)}
								className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:w-64"
							>
								<option value="">No subject</option>
								{subjects.map((subject) => (
									<option key={subject.id} value={subject.id}>
										{subject.name}
									</option>
								))}
							</select>
						</label>
						<Button
							onClick={saveTasks}
							disabled={saving || selectedTaskKeys.length === 0}
						>
							{saving ? <Loader2 className="animate-spin" /> : <Sparkles />}
							{saving ? "Saving..." : `Save ${selectedTaskKeys.length} tasks`}
						</Button>
					</div>
					<div className="grid gap-4 lg:grid-cols-2">
						{plan.days.map((day, dayIndex) => (
							<Card
								key={day.day}
								className="rounded-xl border bg-card py-0 shadow-sm"
							>
								<CardHeader className="px-4 pb-2 pt-4">
									<CardTitle className="text-sm">{day.day}</CardTitle>
									<p className="text-xs text-muted-foreground">{day.focus}</p>
								</CardHeader>
								<CardContent className="space-y-2 px-4 pb-4">
									{day.tasks.map((task, taskIndex) => {
										const key = taskKey(dayIndex, taskIndex);
										return (
											<div
												key={task.title}
												className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"
											>
												<input
													type="checkbox"
													checked={selectedTaskKeys.includes(key)}
													onChange={() => toggleTask(key)}
													aria-label={`Select ${task.title}`}
												/>
												<div className="min-w-0 flex-1">
													<p className="text-xs font-semibold">{task.title}</p>
													<p className="mt-1 text-[11px] text-muted-foreground">
														{task.durationMinutes} minutes
													</p>
												</div>
												<Badge
													variant={
														task.priority === "HIGH" ? "destructive" : "outline"
													}
												>
													{task.priority}
												</Badge>
											</div>
										);
									})}
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			) : (
				<div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
					Your generated plan will appear here.
				</div>
			)}
		</div>
	);
}
