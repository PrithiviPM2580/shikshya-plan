import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Braces,
	Check,
	Clock3,
	FlaskConical,
	Laptop,
	Search,
	Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Logo from "#/components/shared/logo";
import { Button } from "#/components/ui/button";
import { studyLevels } from "#/lib/constants";
import { Progress } from "@/components/ui/progress";
import academicData from "@/data/academic-programs.json";
import { completeOnboarding } from "@/features/onboarding/server/complete-onboarding";
import { getOnboardingStatus } from "@/lib/server-auth";

type AcademicProgram = (typeof academicData.programs)[number];

const programIcons = {
	BCA: Laptop,
	CSIT: Braces,
	BIT: Braces,
} as const;

export const Route = createFileRoute("/(public)/onboarding/")({
	beforeLoad: async () => {
		const status = await getOnboardingStatus();
		if (!status.user) {
			throw redirect({ to: "/sign-in" });
		}
		if (status.isComplete) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: Onboarding,
});

function Onboarding() {
	const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
	const [selected, setSelected] =
		useState<(typeof studyLevels)[number]["id"]>("bca");
	const [selectedProgramName, setSelectedProgramName] = useState("BCA");
	const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
	const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
	const [courseSearch, setCourseSearch] = useState("");

	const selectedProgram =
		academicData.programs.find(
			(program) => program.name === selectedProgramName,
		) ?? academicData.programs[0];
	const canContinue = selectedSemester !== null;
	const progress = step * 25;
	const selectedSemesterData = selectedProgram.semesters.find(
		(semester) => semester.semester === selectedSemester,
	);

	if (step === 1) {
		return (
			<StepOne
				selected={selected}
				onSelect={(levelId) => {
					setSelected(levelId);
					const level = studyLevels.find((item) => item.id === levelId);
					if (level && level.id !== "other") {
						setSelectedProgramName(level.label);
						setSelectedSemester(null);
						setSelectedCourses([]);
					}
				}}
				onNext={() => setStep(2)}
				progress={progress}
			/>
		);
	}

	if (step === 3 && selectedSemesterData) {
		return (
			<StepThree
				program={selectedProgram}
				semester={selectedSemesterData}
				selectedCourses={selectedCourses}
				search={courseSearch}
				progress={progress}
				onSearch={setCourseSearch}
				onToggleCourse={(code) =>
					setSelectedCourses((current) =>
						current.includes(code)
							? current.filter((courseCode) => courseCode !== code)
							: [...current, code],
					)
				}
				onBack={() => setStep(2)}
				onNext={() => setStep(4)}
			/>
		);
	}

	if (step === 4 && selectedSemesterData) {
		return (
			<StepFour
				program={selectedProgram}
				semester={selectedSemesterData}
				selectedCourses={selectedCourses}
				onBack={() => setStep(3)}
				progress={progress}
			/>
		);
	}

	return (
		<div className="min-h-screen w-full px-2 sm:px-8 md:px-16 lg:h-28">
			<header className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-0 py-4 sm:gap-8 sm:py-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Logo />
						<p className="text-lg font-semibold tracking-[-0.04em]">
							Shikshya Plan
						</p>
					</div>

					<div className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.2em] sm:flex">
						<button
							type="button"
							className="transition-colors hover:text-primary"
						>
							Save & Exit
						</button>

						<button
							type="button"
							className="transition-colors hover:text-primary"
						>
							Help
						</button>
					</div>
				</div>

				<Progress value={progress} className="w-full" />
			</header>

			<main className="mx-auto w-full max-w-7xl py-2 sm:py-4">
				<div className="flex w-full flex-col gap-6 md:flex-row">
					{/* Sidebar */}
					<aside className="w-full space-y-5 md:w-72 md:shrink-0 lg:w-80">
						<div className="rounded-2xl border border-[#173a40]/10 bg-white/70 dark:bg-sidebar p-4 shadow-[0_10px_30px_rgba(23,58,64,0.04)] backdrop-blur-sm">
							<h3 className="text-xl font-semibold tracking-[-0.04em]">
								Academic Profile
							</h3>

							<p className="mt-2 text-sm leading-6">
								Your personalized study plan will adapt to these settings.
							</p>

							<div className="mt-5 space-y-4 text-sm">
								<div className="flex items-center justify-between gap-4 border-b border-[#173a40]/10 pb-2">
									<span className="shrink-0 font-medium uppercase tracking-[0.18em]">
										Degree
									</span>

									<span className="min-w-0 truncate text-right font-medium">
										{selectedProgram.name}
									</span>
								</div>

								<div className="flex items-center justify-between gap-4 border-b border-[#173a40]/10 pb-2">
									<span className="shrink-0 font-medium uppercase tracking-[0.18em]">
										Semester
									</span>

									<span className="font-medium">
										{selectedSemester ?? "Pending..."}
									</span>
								</div>

								<div className="flex items-center justify-between gap-4 border-b border-[#173a40]/10 pb-2">
									<span className="shrink-0 font-medium uppercase tracking-[0.18em]">
										Subjects
									</span>

									<span className="font-medium">-</span>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-[#173a40]/10 bg-[#f5f7fb] dark:bg-sidebar p-4 shadow-[0_10px_30px_rgba(23,58,64,0.04)]">
							<div className="mb-3 flex items-center gap-2">
								<div className="size-2 shrink-0 rounded-full bg-primary" />

								<p className="text-xs font-semibold uppercase tracking-[0.2em]">
									Pro Tip
								</p>
							</div>

							<p className="text-sm leading-6">
								Selecting accurate details helps us fetch the most relevant
								syllabi and past papers for you.
							</p>
						</div>
					</aside>

					{/* Main content */}
					<section className="w-full min-w-0 flex-1 rounded-2xl border border-[#173a40]/10 bg-white/80 dark:bg-sidebar p-3 shadow-[0_20px_50px_rgba(23,58,64,0.05)] backdrop-blur-sm sm:p-5 lg:p-6">
						<div className="mb-3 flex items-center justify-between">
							<div>
								<p className="text-xs font-medium uppercase tracking-[0.18em]">
									Step 2 of 4
								</p>
								<p className="mt-2 text-sm">Your Profile</p>
							</div>
							<span className="rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
								{selectedProgram.name}
							</span>
						</div>

						<div className="space-y-2">
							<h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
								Current Standing
							</h1>
							<p className="max-w-2xl text-sm leading-6 md:text-base">
								Tell us where you are in your academic journey to tailor your
								study plan.
							</p>
						</div>

						<div className="mt-4">
							<p className="mb-2 text-sm font-medium">
								Part A: Which semester are you in?
							</p>
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
								{selectedProgram.semesters.map((semester) => {
									const isSelected = selectedSemester === semester.semester;

									return (
										<button
											key={semester.semester}
											type="button"
											onClick={() => {
												setSelectedSemester(semester.semester);
												setSelectedCourses([]);
											}}
											className={[
												"min-h-16 rounded-lg border px-2 py-3 text-center text-sm transition-colors",
												isSelected
													? "border-primary bg-primary text-primary-foreground shadow-sm"
													: "border-transparent bg-muted/50 hover:border-primary/30 hover:bg-primary/5",
											].join(" ")}
										>
											<span className="block">
												{semester.semester.split(" ")[0]}
											</span>
											<span className="mt-1 block text-[11px] uppercase tracking-[0.08em]">
												Semester
											</span>
										</button>
									);
								})}
							</div>
						</div>

						<div className="my-4 border-t border-border" />

						<div>
							<p className="mb-2 text-sm font-medium">
								Part B: Select your major
							</p>
							<div className="grid gap-3 sm:grid-cols-2">
								{academicData.programs.map((program: AcademicProgram) => {
									const Icon =
										programIcons[program.name as keyof typeof programIcons] ??
										FlaskConical;
									const isSelected = selectedProgram.name === program.name;

									return (
										<button
											key={program.name}
											type="button"
											onClick={() => {
												setSelectedProgramName(program.name);
												setSelectedSemester(null);
												setSelectedCourses([]);
											}}
											className={[
												"flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
												isSelected
													? "border-primary bg-primary/5 shadow-sm"
													: "border-transparent bg-muted/50 hover:border-primary/30 hover:bg-primary/5",
											].join(" ")}
										>
											<span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
												<Icon className="size-4" aria-hidden="true" />
											</span>
											<span className="min-w-0 flex-1">
												<span className="block text-sm font-medium">
													{program.name}
												</span>
												<span className="block truncate text-xs text-muted-foreground">
													{program.label}
												</span>
											</span>
											{isSelected && (
												<Check
													className="size-4 shrink-0 text-primary"
													aria-hidden="true"
												/>
											)}
										</button>
									);
								})}
							</div>
						</div>

						<div className="mt-8 flex items-center justify-between gap-3 sm:mt-10">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setStep(1)}
								className="gap-2 text-xs uppercase tracking-[0.12em]"
							>
								<ArrowLeft className="size-4" aria-hidden="true" />
								Back
							</Button>
							<Button
								type="button"
								disabled={!canContinue}
								onClick={() => setStep(3)}
								className="gap-2 text-xs uppercase tracking-[0.12em] dark:text-white"
							>
								Continue
								<ArrowRight className="size-4" aria-hidden="true" />
							</Button>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}

type AcademicSemester = AcademicProgram["semesters"][number];
type AcademicCourse = AcademicSemester["courses"][number];

type StepThreeProps = {
	program: AcademicProgram;
	semester: AcademicSemester;
	progress: number;
	selectedCourses: string[];
	search: string;
	onSearch: (value: string) => void;
	onToggleCourse: (code: string) => void;
	onBack: () => void;
	onNext: () => void;
};

function StepThree({
	program,
	semester,
	progress,
	selectedCourses,
	search,
	onSearch,
	onToggleCourse,
	onBack,
	onNext,
}: StepThreeProps) {
	const visibleCourses = semester.courses.filter((course) =>
		`${course.code} ${course.name}`
			.toLowerCase()
			.includes(search.toLowerCase()),
	);
	const selectedCourseDetails = semester.courses.filter((course) =>
		selectedCourses.includes(course.code),
	);
	const totalCredits = selectedCourseDetails.reduce(
		(total, course) => total + course.credits,
		0,
	);

	return (
		<div className="min-h-screen w-full px-2 sm:px-8 md:px-16">
			<header className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-0 py-4 sm:py-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Logo />
						<p className="text-lg font-semibold tracking-[-0.04em]">
							Shikshya Plan
						</p>
					</div>
					<div className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.2em] sm:flex">
						<button type="button" className="hover:text-primary">
							Save & Exit
						</button>
						<button type="button" className="hover:text-primary">
							Help
						</button>
					</div>
				</div>
				<Progress value={progress} className="w-full" />
			</header>

			<main className="mx-auto w-full max-w-7xl py-2 sm:py-4">
				<div className="flex w-full flex-col gap-6 lg:flex-row">
					<section className="min-w-0 flex-1">
						<div className="mb-5">
							<p className="text-xs font-medium uppercase tracking-[0.18em]">
								Step 3 of 4
							</p>
							<p className="mt-2 text-sm">Your Subjects</p>
						</div>
						<h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
							Choose your subjects
						</h1>
						<p className="mt-2 text-sm leading-6 md:text-base">
							Choose the courses you are taking this term. This builds your
							schedule and resource library.
						</p>

						<div className="mt-7 flex flex-col gap-3 sm:flex-row">
							<label className="relative min-w-0 flex-1">
								<Search
									className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
									aria-hidden="true"
								/>
								<span className="sr-only">Search subjects</span>
								<input
									type="search"
									value={search}
									onChange={(event) => onSearch(event.target.value)}
									placeholder="Search subjects..."
									className="h-11 w-full rounded-lg border border-border bg-muted/40 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
								/>
							</label>
							<Button
								type="button"
								variant="outline"
								className="h-11 shrink-0 gap-2 text-xs uppercase tracking-widest"
								disabled
							>
								+ Custom Subject
							</Button>
						</div>

						<div className="mt-5 grid gap-3 sm:grid-cols-2">
							{visibleCourses.map((course) => (
								<CourseOption
									key={course.code}
									course={course}
									selected={selectedCourses.includes(course.code)}
									onToggle={() => onToggleCourse(course.code)}
								/>
							))}
							{visibleCourses.length === 0 && (
								<p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
									No subjects match your search.
								</p>
							)}
						</div>
					</section>

					<aside className="w-full shrink-0 lg:w-60 xl:w-64">
						<div className="rounded-xl border border-border bg-card p-4 shadow-sm">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Laptop className="size-4" aria-hidden="true" /> Study Profile
							</div>
							<div className="mt-5 space-y-3 text-sm">
								<ProfileRow label="Level" value="Undergraduate" />
								<ProfileRow label="Semester" value={semester.semester} />
								<ProfileRow label="Major" value={program.name} />
							</div>
							<div className="mt-7 border-t border-border pt-5">
								<p className="text-xs font-medium uppercase tracking-[0.14em]">
									Selected subjects
								</p>
								{selectedCourseDetails.length === 0 ? (
									<p className="mt-4 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
										No subjects selected yet.
									</p>
								) : (
									<div className="mt-4 space-y-2">
										{selectedCourseDetails.map((course) => (
											<p key={course.code} className="truncate text-xs">
												{course.name}
											</p>
										))}
									</div>
								)}
							</div>
							<div className="mt-7 flex items-center justify-between border-t border-border pt-4 text-sm">
								<span>Total Credits</span>
								<strong>{totalCredits}</strong>
							</div>
						</div>
					</aside>
				</div>

				<div className="mt-10 flex items-center justify-between gap-3">
					<Button
						type="button"
						variant="ghost"
						onClick={onBack}
						className="gap-2 text-xs uppercase tracking-[0.12em]"
					>
						<ArrowLeft className="size-4" aria-hidden="true" />
						Back
					</Button>
					<Button
						type="button"
						onClick={onNext}
						disabled={selectedCourses.length === 0}
						className="gap-2 text-xs uppercase tracking-[0.12em] dark:text-white"
					>
						Next
						<ArrowRight className="size-4" aria-hidden="true" />
					</Button>
				</div>
			</main>
		</div>
	);
}

function CourseOption({
	course,
	selected,
	onToggle,
}: {
	course: AcademicCourse;
	selected: boolean;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className={[
				"flex min-h-16 items-center gap-3 rounded-xl border p-4 text-left transition-colors",
				selected
					? "border-primary bg-primary/5 shadow-sm"
					: "border-border bg-card hover:border-primary/30",
			].join(" ")}
		>
			<span
				className={[
					"flex size-4 shrink-0 items-center justify-center rounded border",
					selected
						? "border-primary bg-primary text-primary-foreground"
						: "border-input",
				].join(" ")}
			>
				{selected && <Check className="size-3" aria-hidden="true" />}
			</span>
			<span className="min-w-0">
				<span className="block truncate text-sm font-medium">
					{course.name}
				</span>
				<span className="mt-1 block text-xs text-muted-foreground">
					{course.code} • {course.credits} Credits
				</span>
			</span>
		</button>
	);
}

function ProfileRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-3 border-b border-border pb-2 last:border-0">
			<span className="text-muted-foreground">{label}</span>
			<span className="max-w-36 truncate text-right font-medium">{value}</span>
		</div>
	);
}

type StepFourProps = {
	program: AcademicProgram;
	semester: AcademicSemester;
	selectedCourses: string[];
	onBack: () => void;
	progress: number;
};

function StepFour({
	program,
	semester,
	selectedCourses,
	onBack,
	progress,
}: StepFourProps) {
	const navigate = useNavigate();
	const [isCompleting, setIsCompleting] = useState(false);
	const [weeklyHours, setWeeklyHours] = useState(15);
	const [targetGpa, setTargetGpa] = useState(3.8);
	const semesterIndex = program.semesters.findIndex(
		(item) => item.semester === semester.semester,
	);
	const year = Math.ceil((semesterIndex + 1) / 2);
	const yearLabel =
		["Freshman", "Sophomore", "Junior", "Senior"][year - 1] ?? "Student";
	const courses = semester.courses.filter((course) =>
		selectedCourses.includes(course.code),
	);
	const setupScore = Math.min(
		100,
		Math.round(70 + weeklyHours / 2 + targetGpa * 3 + courses.length),
	);

	async function handleComplete() {
		setIsCompleting(true);
		try {
			await completeOnboarding({
				data: {
					programName: program.name,
					semester: semester.semester,
					courses,
					weeklyHours,
					targetGpa,
				},
			});
			navigate({ to: "/dashboard" });
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to complete setup",
			);
		} finally {
			setIsCompleting(false);
		}
	}

	return (
		<div className="min-h-screen w-full px-2 sm:px-8 md:px-16">
			<header className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-0 py-4 sm:py-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Logo />
						<p className="text-lg font-semibold tracking-[-0.04em]">
							Shikshya Plan
						</p>
					</div>
					<div className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.2em] sm:flex">
						<button type="button" className="hover:text-primary">
							Save & Exit
						</button>
						<button type="button" className="hover:text-primary">
							Help
						</button>
					</div>
				</div>
				<Progress value={progress} className="w-full" />
			</header>

			<main className="mx-auto w-full max-w-7xl py-2 sm:py-4">
				<div className="mb-8">
					<p className="text-xs font-medium uppercase tracking-[0.18em]">
						Step 4 of 4
					</p>
					<p className="mt-2 text-sm">Final Touch: Set Your Goals</p>
					<p className="mt-3 max-w-2xl text-sm leading-6 md:text-base">
						Defining clear targets helps Shikshya Plan optimize your schedule
						and provide actionable insights.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
					<div className="space-y-5">
						<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
							<div className="flex items-start gap-4">
								<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Clock3 className="size-5" aria-hidden="true" />
								</span>
								<div className="min-w-0 flex-1">
									<p className="font-medium">Weekly Study Target</p>
									<p className="mt-1 text-sm text-muted-foreground">
										Recommended: 15-20 hours for your major.
									</p>
								</div>
								<strong className="text-primary">{weeklyHours}h</strong>
							</div>
							<input
								type="range"
								min="0"
								max="40"
								step="1"
								value={weeklyHours}
								onChange={(event) => setWeeklyHours(Number(event.target.value))}
								className="mt-6 h-2 w-full accent-primary"
								aria-label="Weekly study target in hours"
							/>
							<div className="mt-2 flex justify-between text-xs text-muted-foreground">
								<span>0h</span>
								<span>20 hours</span>
								<span>40h+</span>
							</div>
						</div>

						<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
							<div className="flex items-start gap-4">
								<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Star className="size-5" aria-hidden="true" />
								</span>
								<div>
									<p className="font-medium">Target GPA / Grade</p>
									<p className="mt-1 text-sm text-muted-foreground">
										Aim high, but stay realistic.
									</p>
								</div>
							</div>
							<input
								type="number"
								min="0"
								max="4"
								step="0.1"
								value={targetGpa}
								onChange={(event) => setTargetGpa(Number(event.target.value))}
								className="mt-5 h-12 w-28 rounded-lg border border-border bg-muted/40 px-3 text-center text-lg font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
								aria-label="Target GPA"
							/>
						</div>
					</div>

					<aside className="rounded-2xl bg-primary p-6 text-white shadow-lg">
						<div className="flex items-center gap-2 text-sm font-medium">
							<Check className="size-4" aria-hidden="true" /> Onboarding Summary
						</div>
						<div className="mt-7 grid grid-cols-2 gap-5 text-sm">
							<div>
								<p className="text-xs uppercase tracking-[0.12em] text-white/60">
									Level
								</p>
								<p className="mt-1">Undergraduate</p>
							</div>
							<div>
								<p className="text-xs uppercase tracking-[0.12em] text-white/60">
									Year
								</p>
								<p className="mt-1">
									{yearLabel} ({year}
									{year === 1
										? "st"
										: year === 2
											? "nd"
											: year === 3
												? "rd"
												: "th"}{" "}
									Year)
								</p>
							</div>
						</div>
						<div className="mt-6">
							<p className="text-xs uppercase tracking-[0.12em] text-white/60">
								Major
							</p>
							<p className="mt-1">{program.label}</p>
						</div>
						<div className="mt-6">
							<p className="text-xs uppercase tracking-[0.12em] text-white/60">
								Selected Subjects
							</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{courses.slice(0, 3).map((course) => (
									<span
										key={course.code}
										className="rounded-full bg-white/10 px-3 py-1 text-xs"
									>
										{course.name}
									</span>
								))}
								{courses.length > 3 && (
									<span className="rounded-full bg-white/10 px-3 py-1 text-xs">
										+{courses.length - 3} more
									</span>
								)}
							</div>
						</div>
						<div className="mt-7 flex items-end justify-between border-t border-white/15 pt-5">
							<div>
								<p className="text-xs uppercase tracking-[0.12em] text-primary-foreground/70">
									Predicted Setup Score
								</p>
								<p className="mt-1 text-lg font-semibold">{setupScore}/100</p>
							</div>
							<div className="flex size-14 items-center justify-center rounded-full border-4 border-primary text-sm font-semibold">
								{setupScore}
							</div>
						</div>
					</aside>
				</div>

				<div className="mt-8 flex items-center justify-between gap-3">
					<Button
						type="button"
						variant="ghost"
						onClick={onBack}
						className="gap-2 text-xs uppercase tracking-[0.12em]"
					>
						<ArrowLeft className="size-4" aria-hidden="true" />
						Back
					</Button>
					<Button
						onClick={handleComplete}
						type="button"
						disabled={isCompleting}
						className="gap-2 text-xs uppercase tracking-[0.12em] dark:text-white"
					>
						Complete Setup
						<ArrowRight className="size-4" aria-hidden="true" />
					</Button>
				</div>
			</main>
		</div>
	);
}

type StepOneProps = {
	selected: (typeof studyLevels)[number]["id"];
	onSelect: (value: (typeof studyLevels)[number]["id"]) => void;
	onNext: () => void;
	progress: number;
};

function StepOne({ selected, onSelect, onNext, progress }: StepOneProps) {
	return (
		<div className="min-h-screen w-full px-2 sm:px-8 md:px-16">
			<header className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-0 py-4 sm:py-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Logo />
						<p className="text-lg font-semibold tracking-[-0.04em]">
							Shikshya Plan
						</p>
					</div>
					<button
						type="button"
						className="text-xs uppercase tracking-[0.12em] hover:text-primary"
					>
						Save & Exit
					</button>
				</div>
				<Progress value={progress} className="w-full" />
			</header>

			<main className="mx-auto w-full max-w-3xl py-8">
				<div className="mb-5 flex w-fit items-center rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
					Step 1 of 4
				</div>
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
					Welcome to Shikshya Plan
				</h1>
				<p className="mt-2 max-w-2xl text-sm leading-6 md:text-base">
					Let&apos;s personalize your study space. First, tell us about your
					current academic focus.
				</p>
				<h2 className="mt-8 text-lg font-medium">
					What is your current study level?
				</h2>
				<div className="mt-4 grid gap-4 sm:grid-cols-2">
					{studyLevels.map((level) => {
						const isSelected = selected === level.id;
						return (
							<button
								key={level.id}
								type="button"
								onClick={() => onSelect(level.id)}
								className={[
									"min-h-36 rounded-2xl border p-5 text-left transition-colors",
									isSelected
										? "border-primary bg-primary/5 shadow-sm"
										: "border-border bg-muted/40 hover:border-primary/30",
								].join(" ")}
							>
								<span className="mb-4 flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
									{level.short}
								</span>
								<span className="block text-xl font-semibold">
									{level.label}
								</span>
								<span className="mt-1 block text-sm text-muted-foreground">
									{level.subtitle}
								</span>
							</button>
						);
					})}
				</div>
				<div className="mt-8 flex justify-end">
					<Button
						type="button"
						onClick={onNext}
						className="gap-2 text-xs uppercase tracking-[0.12em] dark:text-white"
					>
						Next Step <ArrowRight className="size-4" aria-hidden="true" />
					</Button>
				</div>
			</main>
		</div>
	);
}
