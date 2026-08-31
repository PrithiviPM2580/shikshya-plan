/** biome-ignore-all lint/a11y/useValidAnchor: <explanation> */
import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	Calendar,
	CheckCircle2,
	Clock3,
	MoonStar,
	Sparkles,
	Star,
	Target,
	Timer,
	TrendingUp,
} from "lucide-react";
import Logo from "#/components/shared/logo";
import { Button } from "#/components/ui/button";

const navItems = [
	{ label: "Features", href: "#features" },
	{ label: "How it works", href: "#how" },
	{ label: "Students", href: "#testimonials" },
];

const featureItems = [
	{
		icon: BookOpen,
		title: "Subjects & Plans",
		desc: "Organize coursework in a clean, focused system and map each subject to a clear study rhythm.",
	},
	{
		icon: CheckCircle2,
		title: "Tasks & Sessions",
		desc: "Break goals into daily study blocks, prioritize tasks, and track completion without the chaos.",
	},
	{
		icon: Calendar,
		title: "Unified Calendar",
		desc: "See exams, tasks, and study sessions across the week or month in one calm timeline.",
	},
	{
		icon: Target,
		title: "Exams & Goals",
		desc: "Stay ahead with countdowns, milestones, and academic goals that keep motivation visible.",
	},
	{
		icon: TrendingUp,
		title: "Progress Analytics",
		desc: "Measure your study hours, consistency, and performance by subject with simple visual insights.",
	},
	{
		icon: Timer,
		title: "Pomodoro Timer",
		desc: "Focus deeper with timed sessions and controlled breaks that help you sustain momentum.",
	},
];

const steps = [
	{
		n: "1",
		t: "Add your subjects",
		d: "Set up the courses, topics, and subject colors that matter most for your semester.",
	},
	{
		n: "2",
		t: "Build a plan",
		d: "Create purposeful study sessions with priority, deadlines, and realistic weekly pacing.",
	},
	{
		n: "3",
		t: "Show up daily",
		d: "Log your work, stay consistent, and let the momentum grow one at a time.",
	},
];

const testimonials = [
	{
		q: "Finally an app that respects my focus. My study hours became consistent instead of stressful.",
		n: "Aarav, Engineering",
	},
	{
		q: "The calendar view makes exam prep feel manageable. I know exactly what to work on next.",
		n: "Priya, Med student",
	},
	{
		q: "I love how simple it feels. It keeps me disciplined without creating extra pressure.",
		n: "Nisha, MBA",
	},
];

const scrollToSection = (
	event: React.MouseEvent<HTMLAnchorElement>,
	sectionId: string,
) => {
	event.preventDefault();
	const element = document.getElementById(sectionId);
	if (!element) return;

	element.scrollIntoView({ behavior: "smooth", block: "start" });
	window.history.pushState(null, "", `#${sectionId}`);
};

export default function Landing() {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.09),_transparent_35%),_linear-gradient(180deg,_#f8faf9_0%,_#f5f7fb_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_35%),_linear-gradient(180deg,_#0f172a_0%,_#1e293b_100%)] text-foreground">
			<header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 dark:bg-slate-950/80 backdrop-blur-xl">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
					<Link
						to="/"
						className="flex items-center gap-2 text-foreground no-underline hover:text-foreground"
					>
						<Logo className="size-8" />
						<span className="text-lg font-semibold tracking-tight">
							Shikshya Plan
						</span>
					</Link>
					<nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
						{navItems.map((item) => (
							<a
								key={item.href}
								href={item.href}
								onClick={(event) =>
									scrollToSection(event, item.href.replace("#", ""))
								}
								className="transition-colors duration-200 hover:text-foreground"
							>
								{item.label}
							</a>
						))}
					</nav>
					<div className="flex items-center gap-2">
						<Button asChild>
							<Link to="/sign-in">Get started</Link>
						</Button>
					</div>
				</div>
			</header>

			<section className="relative overflow-hidden">
				<div className="absolute inset-0 -z-10 opacity-90">
					<div className="absolute -top-24 left-1/2 h-96 w-[38rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
					<div className="absolute right-8 top-28 h-52 w-52 rounded-full bg-violet-400/12 blur-3xl" />
					<div className="absolute left-12 top-48 h-48 w-48 rounded-full bg-emerald-400/12 blur-3xl" />
				</div>

				<div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pt-16 pb-20 text-center md:pt-20 lg:pt-24">
					<div className="max-w-3xl">
						<div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-900 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-emerald-900 dark:text-emerald-200 shadow-sm backdrop-blur">
							<Sparkles className="h-3.5 w-3.5 text-emerald-600" />
							Built for students who want calm, consistent progress
						</div>
						<h1 className="mt-6 leading-[0.9] tracking-[-0.05em] text-foreground">
							<span className="block text-[2.8rem] font-semibold md:text-[4.2rem] lg:text-[4.6rem]">
								Study Smarter, Achieve
							</span>
							<span className="mt-2 block text-[2.8rem] font-semibold tracking-[-0.04em] text-foreground/80 md:text-[4.2rem] lg:text-[4.6rem]">
								<span className="bg-linear-to-r from-primary via-violet-500 to-emerald-600 bg-clip-text text-transparent">
									your goals.
								</span>
							</span>
						</h1>
						<p className="mt-6 text-base text-muted-foreground md:text-lg">
							Shikshya Plan is the modern study workspace for students —
							subjects, plans, tasks, exams, and a calendar that keeps
							everything in view.
						</p>
						<div className="mt-8 flex flex-wrap justify-center gap-3">
							<Button size="lg" asChild>
								<Link to="/sign-in">
									Start planning free <ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50"
								asChild
							>
								<a
									href="#features"
									onClick={(event) => scrollToSection(event, "features")}
								>
									See features
								</a>
							</Button>
						</div>
						<div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
							<div className="flex items-center gap-2 rounded-full border border-border dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-3 py-1.5">
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
								4.9 student rating
							</div>
							<div className="flex items-center gap-2">
								<Clock3 className="h-4 w-4 text-primary" />
								Average 2.5h/day focus
							</div>
						</div>
					</div>

					<div className="relative w-full max-w-208">
						<div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/15 via-violet-400/10 to-emerald-400/20 dark:from-primary/25 dark:via-violet-600/15 dark:to-emerald-600/25 blur-2xl" />
						<div className="relative rounded-[2rem] border border-border/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.08)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.3)] backdrop-blur-lg">
							<div className="rounded-[1.5rem] border border-border dark:border-slate-700 bg-[#f7faf8] dark:bg-slate-900 p-4 md:p-5">
								<div className="flex items-center justify-between border-b border-border pb-4">
									<div className="flex flex-col items-start">
										<p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
											This week
										</p>
										<h3 className="mt-1 text-xl font-semibold text-foreground">
											Study overview
										</h3>
									</div>
									<div className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
										82% on track
									</div>
								</div>

								<div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_0.85fr]">
									<div className="space-y-4">
										<div className="grid gap-4 sm:grid-cols-3">
											<div className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
												<p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
													Hours
												</p>
												<p className="mt-2 text-2xl font-bold">14.5</p>
											</div>
											<div className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
												<p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
													Tasks
												</p>
												<p className="mt-2 text-2xl font-bold">18</p>
											</div>
											<div className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
												<p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
													Streak
												</p>
												<p className="mt-2 text-2xl font-bold">9 days</p>
											</div>
										</div>

										<div className="h-52 rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-3 sm:h-56 md:h-60">
											<div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
												<span className="font-medium text-foreground">
													Weekly workload
												</span>
												<span className="text-muted-foreground">This week</span>
											</div>
											<div className="flex h-28 items-end gap-2 sm:h-32">
												{[42, 64, 52, 84, 75, 90, 68].map((height, index) => (
													<div key={height + index} className="flex-1">
														<div
															className="w-full rounded-t-xl bg-gradient-to-t from-primary to-violet-300"
															style={{ height: `${height}%` }}
														/>
													</div>
												))}
											</div>
										</div>
									</div>

									<div className="space-y-4">
										<div className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
											<div className="flex items-center justify-between text-sm">
												<span className="font-medium text-foreground">
													Upcoming
												</span>
												<span className="text-muted-foreground">3 tasks</span>
											</div>
											<div className="mt-4 space-y-3">
												<div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2.5">
													<div className="flex items-center justify-between text-sm">
														<span className="font-medium text-foreground">
															Biology quiz
														</span>
														<span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
															Today
														</span>
													</div>
													<p className="mt-1 text-xs text-muted-foreground">
														6:00 PM · Chapter 7
													</p>
												</div>
												<div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2.5">
													<div className="flex items-center justify-between text-sm">
														<span className="font-medium text-foreground">
															Math revision
														</span>
														<span className="text-[10px] font-medium text-violet-600 dark:text-violet-400">
															Tomorrow
														</span>
													</div>
													<p className="mt-1 text-xs text-muted-foreground">
														8:30 AM · Algebra set
													</p>
												</div>
											</div>
										</div>

										<div className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
											<div className="flex items-center justify-between text-sm">
												<span className="font-medium text-foreground">
													Subjects
												</span>
												<span className="text-muted-foreground">Progress</span>
											</div>
											<div className="mt-4 space-y-3">
												{[
													{ name: "Math", value: 74, color: "bg-primary" },
													{
														name: "Biology",
														value: 82,
														color: "bg-emerald-500",
													},
													{
														name: "History",
														value: 68,
														color: "bg-violet-500",
													},
												].map((subject) => (
													<div key={subject.name}>
														<div className="mb-1 flex items-center justify-between text-xs">
															<span className="font-medium text-foreground">
																{subject.name}
															</span>
															<span className="text-muted-foreground">
																{subject.value}%
															</span>
														</div>
														<div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
															<div
																className={`h-full rounded-full ${subject.color}`}
																style={{ width: `${subject.value}%` }}
															/>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section
				id="features"
				className="scroll-mt-32 border-t border-border/60 bg-white/60 dark:bg-slate-950/40 py-24"
			>
				<div className="mx-auto max-w-6xl px-6">
					<div className="mx-auto max-w-2xl text-center">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
							Features
						</p>
						<h2 className="mt-4 text-4xl tracking-tight text-foreground md:text-5xl">
							Everything your study week needs
						</h2>
						<p className="mt-4 text-muted-foreground">
							One focused workspace for subjects, plans, sessions, and the daily
							rhythm that helps students stay on track.
						</p>
					</div>
					<div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
						{featureItems.map((feature) => (
							<div
								key={feature.title}
								className="group rounded-3xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.03)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(79,184,178,0.12)] dark:hover:shadow-[0_24px_60px_rgba(79,184,178,0.2)]"
							>
								<div className="inline-flex rounded-2xl bg-primary/10 dark:bg-primary/20 p-3 text-primary">
									<feature.icon className="h-5 w-5" />
								</div>
								<h3 className="mt-5 text-xl font-semibold text-foreground">
									{feature.title}
								</h3>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									{feature.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section id="how" className="scroll-mt-32 py-24">
				<div className="mx-auto max-w-6xl px-6">
					<div className="mx-auto max-w-2xl text-center">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
							How it works
						</p>
						<h2 className="mt-4 text-4xl tracking-tight md:text-5xl">
							A simple system that keeps students consistent
						</h2>
					</div>
					<div className="mt-14 grid gap-6 lg:grid-cols-3">
						{steps.map((step, index) => {
							const styles = [
								"border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 dark:from-emerald-950 to-white dark:to-slate-900",
								"border-violet-200 dark:border-violet-900 bg-gradient-to-br from-violet-50 dark:from-violet-950 to-white dark:to-slate-900",
								"border-sky-200 dark:border-sky-900 bg-gradient-to-br from-sky-50 dark:from-sky-950 to-white dark:to-slate-900",
							];
							const badges = [
								"bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
								"bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300",
								"bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300",
							];
							const numbers = [
								"bg-emerald-600 dark:bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/50",
								"bg-violet-600 dark:bg-violet-600 text-white shadow-violet-200 dark:shadow-violet-900/50",
								"bg-sky-600 dark:bg-sky-600 text-white shadow-sky-200 dark:shadow-sky-900/50",
							];

							return (
								<div
									key={step.n}
									className={`relative rounded-[1.75rem] border p-6 shadow-[0_18px_40px_rgba(15,23,42,0.03)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.3)] ${styles[index]} ${index === 0 ? "dark:border-emerald-900 dark:bg-slate-900" : index === 1 ? "dark:border-violet-900 dark:bg-slate-900" : "dark:border-sky-900 dark:bg-slate-900"}`}
								>
									<div className="flex items-center justify-between gap-4">
										<div
											className={`grid h-12 w-12 place-items-center rounded-2xl text-base font-bold shadow-lg ${numbers[index]}`}
										>
											{step.n}
										</div>
										<span
											className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${badges[index]}`}
										>
											Step {step.n}
										</span>
									</div>
									<h3 className="mt-6 text-2xl font-semibold text-foreground">
										{step.t}
									</h3>
									<p className="mt-3 text-sm leading-7 text-muted-foreground">
										{step.d}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section
				id="testimonials"
				className="scroll-mt-32 border-t border-border/60 bg-[#f5f7fb] dark:bg-slate-950 py-24"
			>
				<div className="mx-auto max-w-5xl px-6">
					<div className="text-center">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
							Students
						</p>
						<h2 className="mt-4 text-4xl tracking-tight md:text-5xl">
							Students who plan with clarity
						</h2>
					</div>
					<div className="mt-12 grid gap-6 md:grid-cols-3">
						{testimonials.map((item) => (
							<blockquote
								key={item.n}
								className="rounded-3xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.03)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
							>
								<div className="mb-4 flex items-center gap-1 text-amber-400">
									{Array.from({ length: 5 }).map((_, idx) => (
										<Star
											key={`${item.n}-${idx}`}
											className="h-4 w-4 fill-current"
										/>
									))}
								</div>
								<p className="text-base leading-7 text-foreground">
									“{item.q}”
								</p>
								<footer className="mt-5 text-sm font-medium text-muted-foreground">
									— {item.n}
								</footer>
							</blockquote>
						))}
					</div>
				</div>
			</section>

			<section className="py-24 px-6">
				<div className="mx-auto max-w-4xl rounded-[2rem] border border-border dark:border-slate-700 bg-gradient-to-r from-primary/10 via-violet-500/8 to-emerald-500/10 dark:from-primary/20 dark:via-violet-600/15 dark:to-emerald-600/20 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.05)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.3)] md:p-12">
					<div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-900 bg-white/70 dark:bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-200">
						<MoonStar className="h-3.5 w-3.5" />
						Designed for better study habits
					</div>
					<h2 className="mt-5 text-4xl tracking-tight md:text-5xl">
						Ready to plan a better semester?
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
						Join Shikshya Plan and turn your goals into a realistic, calmer
						study routine that actually lasts.
					</p>
					<div className="mt-8 text-sm text-muted-foreground">
						A calmer way to study, plan, and stay consistent.
					</div>
				</div>
			</section>

			<footer className="border-t border-border/60 bg-white/40 dark:bg-slate-950/40 py-10 text-center text-sm text-muted-foreground">
				© {new Date().getFullYear()} Shikshya Plan. Made for students,
				everywhere.
			</footer>
		</div>
	);
}
