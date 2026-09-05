import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
	BookOpen,
	Check,
	Pause,
	Play,
	RotateCcw,
	Square,
	Volume2,
	VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { getPomodoroOptions } from "#/features/pomodoro/server/options";
import {
	completePomodoro,
	getPomodoroSessions,
	startPomodoro,
} from "#/features/pomodoro/server/pomodoro";
import { getProfile } from "#/features/profile/server/profile";

export const Route = createFileRoute("/(private)/_dashboard/pomodoro/")({
	loader: async () => {
		const [sessions, subjects, profileData] = await Promise.all([
			getPomodoroSessions(),
			getPomodoroOptions(),
			getProfile(),
		]);
		return {
			sessions,
			subjects,
			pomodoroLength: profileData.profile?.pomodoroLength ?? 25,
		};
	},
	component: PomodoroPage,
});

function PomodoroPage() {
	const { sessions, subjects, pomodoroLength } = Route.useLoaderData();
	const router = useRouter();
	const [minutes, setMinutes] = useState(pomodoroLength);
	const [remaining, setRemaining] = useState(pomodoroLength * 60);
	const [title, setTitle] = useState("");
	const [subjectId, setSubjectId] = useState("");
	const [activeId, setActiveId] = useState<string | null>(null);
	const [running, setRunning] = useState(false);
	const [saving, setSaving] = useState(false);
	const [phase, setPhase] = useState<"focus" | "break">("focus");
	const [cycle, setCycle] = useState(1);
	const [breakMinutes, setBreakMinutes] = useState(5);
	const [autoStartNext, setAutoStartNext] = useState(true);
	const [atmosphere, setAtmosphere] = useState<"off" | "brown-noise">("off");
	const today = new Date().toDateString();
	const todaySessions = sessions.filter(
		(session) => new Date(session.startedAt).toDateString() === today,
	);
	const completedToday = todaySessions.filter((session) => session.completed);

	useEffect(() => {
		if (!running) return;
		const timer = window.setInterval(
			() => setRemaining((value) => Math.max(0, value - 1)),
			1000,
		);
		return () => window.clearInterval(timer);
	}, [running]);

	useEffect(() => {
		if (running && remaining === 0) void completePhase();
	}, [remaining, running]);

	useEffect(() => {
		if (atmosphere !== "brown-noise") return;
		const context = new AudioContext();
		const buffer = context.createBuffer(
			1,
			context.sampleRate * 2,
			context.sampleRate,
		);
		const output = buffer.getChannelData(0);
		let last = 0;
		for (let index = 0; index < output.length; index += 1) {
			const white = Math.random() * 2 - 1;
			last = last * 0.98 + white * 0.02;
			output[index] = last * 0.35;
		}
		const source = context.createBufferSource();
		const gain = context.createGain();
		source.buffer = buffer;
		source.loop = true;
		gain.gain.value = 0.08;
		source.connect(gain).connect(context.destination);
		source.start();
		return () => {
			source.stop();
			void context.close();
		};
	}, [atmosphere]);

	function reset() {
		setRunning(false);
		setActiveId(null);
		setPhase("focus");
		setCycle(1);
		setRemaining(minutes * 60);
	}
	function changeMinutes(value: number) {
		setMinutes(value);
		if (!running) setRemaining(value * 60);
	}
	async function begin() {
		if (phase === "break") return;
		await startFocusSession();
	}
	async function startFocusSession() {
		setSaving(true);
		try {
			const session = await startPomodoro({
				data: {
					title: title || undefined,
					subjectId: subjectId || null,
					focusMinutes: minutes,
				},
			});
			setActiveId(session.id);
			setPhase("focus");
			setRemaining(minutes * 60);
			setRunning(true);
			toast.success("Focus session started");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to start session",
			);
		} finally {
			setSaving(false);
		}
	}
	async function completePhase() {
		if (phase === "break") {
			setCycle((value) => (value >= 4 ? 1 : value + 1));
			setPhase("focus");
			setRemaining(minutes * 60);
			if (autoStartNext) await startFocusSession();
			else setRunning(false);
			return;
		}
		if (!activeId) return;
		setRunning(false);
		try {
			await completePomodoro({ data: { id: activeId } });
			setActiveId(null);
			await router.invalidate();
			setPhase("break");
			setRemaining(breakMinutes * 60);
			setRunning(true);
			toast.success("Focus session completed. Break started.");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to complete session",
			);
		}
	}
	async function finish() {
		if (!activeId) return;
		setRunning(false);
		try {
			await completePomodoro({ data: { id: activeId } });
			setActiveId(null);
			setPhase("focus");
			setCycle(1);
			setRemaining(minutes * 60);
			await router.invalidate();
			toast.success("Focus session ended");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to end session",
			);
		}
	}
	const displayMinutes = String(Math.floor(remaining / 60)).padStart(2, "0");
	const displaySeconds = String(remaining % 60).padStart(2, "0");

	return (
		<div className="w-full">
			<div className="grid min-h-[calc(100vh-7rem)] gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
				<section className="flex flex-col items-center justify-center rounded-xl bg-muted/30 px-4 py-8">
					<div className="flex size-64 items-center justify-center rounded-full border-8 border-primary/20 border-t-primary sm:size-72">
						<div className="text-center">
							<p className="text-6xl font-bold tracking-tight sm:text-7xl">
								{displayMinutes}:{displaySeconds}
							</p>
							<p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
								<span className="mr-1 inline-block size-1.5 rounded-full bg-primary" />
								{phase === "break"
									? "On break"
									: running
										? "Focusing"
										: "Ready"}
							</p>
						</div>
					</div>
					<div className="mt-8 flex items-center gap-5">
						<Button
							variant="ghost"
							size="icon-lg"
							onClick={reset}
							aria-label="Reset timer"
						>
							<RotateCcw />
						</Button>
						{running ? (
							<Button
								variant="secondary"
								size="icon-lg"
								className="size-14 rounded-full"
								onClick={() => setRunning(false)}
								aria-label="Pause timer"
							>
								<Pause />
							</Button>
						) : (
							<Button
								size="icon-lg"
								className="size-14 rounded-full"
								onClick={begin}
								disabled={saving || remaining === 0 || phase === "break"}
								aria-label="Start timer"
							>
								<Play className="size-6" />
							</Button>
						)}
						<Button
							variant="destructive"
							size="icon-lg"
							onClick={finish}
							disabled={!activeId}
							aria-label="End session"
						>
							<Square />
						</Button>
					</div>
					<div className="mt-6 grid w-full max-w-md gap-3 sm:grid-cols-3">
						<label className="space-y-1 text-sm">
							<span className="font-medium">Focus minutes</span>
							<Input
								type="number"
								min="1"
								max="120"
								value={minutes}
								onChange={(event) => changeMinutes(Number(event.target.value))}
								disabled={running || phase === "break"}
							/>
						</label>
						<label className="space-y-1 text-sm">
							<span className="font-medium">Break minutes</span>
							<Input
								type="number"
								min="1"
								max="30"
								value={breakMinutes}
								onChange={(event) =>
									setBreakMinutes(Number(event.target.value))
								}
								disabled={running}
							/>
						</label>
						<label className="space-y-1 text-sm sm:col-span-2">
							<span className="font-medium">Session title (optional)</span>
							<Input
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder="What are you working on?"
								disabled={running}
							/>
						</label>
						<label className="space-y-1 text-sm sm:col-span-3">
							<span className="font-medium">Subject (optional)</span>
							<select
								value={subjectId}
								onChange={(event) => setSubjectId(event.target.value)}
								disabled={running}
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
						<div className="flex flex-wrap items-center gap-3 text-sm sm:col-span-3">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={autoStartNext}
									onChange={(event) => setAutoStartNext(event.target.checked)}
								/>
								Auto-start next focus session
							</label>
							<span className="flex items-center gap-2">
								{atmosphere === "brown-noise" ? (
									<Volume2 className="size-4" />
								) : (
									<VolumeX className="size-4" />
								)}
								Atmosphere
								<select
									value={atmosphere}
									onChange={(event) =>
										setAtmosphere(event.target.value as typeof atmosphere)
									}
									className="h-8 rounded-md border border-input bg-background px-2 text-xs"
								>
									<option value="off">Off</option>
									<option value="brown-noise">Brown noise</option>
								</select>
							</span>
							<span className="text-muted-foreground">Cycle {cycle} of 4</span>
						</div>
					</div>
				</section>
				<aside>
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center justify-between px-4 pb-3 pt-4">
							<CardTitle className="text-sm">Today’s Sessions</CardTitle>
							<Badge variant="secondary">
								{completedToday.length} completed
							</Badge>
						</CardHeader>
						<CardContent className="space-y-2 px-4 pb-5">
							{todaySessions.map((session) => (
								<div
									key={session.id}
									className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
								>
									<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
										<BookOpen className="size-4" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-xs font-semibold">
											{session.title ||
												session.subject?.name ||
												"Focus session"}
										</p>
										<p className="mt-1 text-[10px] text-muted-foreground">
											{session.focusMinutes} minutes
										</p>
									</div>
									{session.completed && (
										<Check className="size-4 text-primary" />
									)}
								</div>
							))}
							{todaySessions.length === 0 && (
								<p className="py-6 text-center text-xs text-muted-foreground">
									No focus sessions today.
								</p>
							)}
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
