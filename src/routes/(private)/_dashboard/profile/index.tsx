import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	CalendarDays,
	CheckCircle2,
	Code2,
	ExternalLink,
	Flame,
	GraduationCap,
	Link,
	MapPin,
	PenLine,
	Settings2,
	Timer,
	UserRound,
} from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";

export const Route = createFileRoute("/(private)/_dashboard/profile/")({
	component: RouteComponent,
});

function RouteComponent() {
	const preferences = [
		["Preferred time", "Morning", CalendarDays],
		["Pomodoro length", "25m / 5m", Timer],
		["Study audio", "Lo-Fi / Brown Noise", BookOpen],
		["Group study", "Occasionally", UserRound],
	];

	return (
		<div className="w-full space-y-5">
			<section className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
						Account
					</p>
					<h1 className="mt-1 text-2xl font-bold tracking-tight">Profile</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Your learning identity and study preferences.
					</p>
				</div>
				<Button>
					<PenLine /> Edit Profile
				</Button>
			</section>

			<Card className="overflow-hidden rounded-xl border bg-card py-0 shadow-sm">
				<CardContent className="grid gap-6 p-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center lg:p-7">
					<div className="flex items-center gap-4 lg:border-r lg:border-border/60 lg:pr-6">
						<div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground ring-4 ring-primary/10">
							AM
						</div>
						<div>
							<p className="text-sm font-bold">Alex Mercer</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Junior · Computer Science & Chemistry
							</p>
							<p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
								<MapPin className="size-3" /> Kathmandu, Nepal
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						<div className="rounded-lg bg-muted/60 p-3 text-center">
							<GraduationCap className="mx-auto size-4 text-primary" />
							<p className="mt-2 text-lg font-bold">3.8</p>
							<p className="text-[10px] uppercase text-muted-foreground">
								Overall GPA
							</p>
						</div>
						<div className="rounded-lg bg-muted/60 p-3 text-center">
							<Timer className="mx-auto size-4 text-primary" />
							<p className="mt-2 text-lg font-bold">450h</p>
							<p className="text-[10px] uppercase text-muted-foreground">
								Study hours
							</p>
						</div>
						<div className="rounded-lg bg-muted/60 p-3 text-center">
							<CheckCircle2 className="mx-auto size-4 text-primary" />
							<p className="mt-2 text-lg font-bold">12</p>
							<p className="text-[10px] uppercase text-muted-foreground">
								Mastered
							</p>
						</div>
						<div className="rounded-lg bg-muted/60 p-3 text-center">
							<Flame className="mx-auto size-4 text-primary" />
							<p className="mt-2 text-lg font-bold">7d</p>
							<p className="text-[10px] uppercase text-muted-foreground">
								Current streak
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
				<main className="space-y-5">
					<Card className="rounded-xl border bg-primary/5 py-0 shadow-sm">
						<CardHeader className="px-5 pb-2 pt-5">
							<CardTitle className="flex items-center gap-2 text-sm">
								<UserRound className="size-4 text-primary" /> About me
							</CardTitle>
						</CardHeader>
						<CardContent className="px-5 pb-5">
							<p className="text-xs leading-5 text-muted-foreground">
								Passionate about bridging the gap between computational models
								and biochemical processes. Currently focusing on applying
								machine learning techniques to predict protein folding
								structures and building a consistent study practice.
							</p>
							<div className="mt-4 flex flex-wrap gap-2">
								<Badge variant="secondary">Python</Badge>
								<Badge variant="secondary">Data Science</Badge>
								<Badge variant="secondary">Organic Chemistry</Badge>
								<Badge variant="secondary">UI Design</Badge>
								<Badge variant="secondary">Bioinformatics</Badge>
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="px-5 pb-2 pt-5">
							<CardTitle className="flex items-center gap-2 text-sm">
								<GraduationCap className="size-4 text-primary" /> Academic
								timeline
							</CardTitle>
						</CardHeader>
						<CardContent className="px-5 pb-5">
							<div className="space-y-5 border-l border-border pl-5">
								{[
									[
										"Junior Year, Fall",
										"Focusing on Advanced Algorithms and Biochemistry II. Research assistant in Dr. Lin's lab.",
										"Current",
									],
									[
										"Sophomore Year, Spring",
										"Dean's List. Completed core chemistry sequence. Developed a study app for peers.",
										"",
									],
									[
										"Sophomore Year, Fall",
										"Declared double major. Data Structures & Intro to Organic Chemistry.",
										"",
									],
								].map(([title, detail, status], index) => (
									<div key={title} className="relative">
										<span
											className={`absolute -left-6 top-0.5 size-3 rounded-full border-2 border-card ${index === 0 ? "bg-primary" : "bg-muted-foreground/30"}`}
										/>
										<div className="flex flex-wrap items-center justify-between gap-2">
											<p className="text-xs font-semibold">{title}</p>
											{status && (
												<Badge variant="secondary" className="text-[10px]">
													{status}
												</Badge>
											)}
										</div>
										<p className="mt-1 text-[11px] leading-4 text-muted-foreground">
											{detail}
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</main>

				<aside className="space-y-5">
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center gap-2 px-4 pb-2 pt-4">
							<Settings2 className="size-4 text-primary" />
							<CardTitle className="text-sm">Study preferences</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 px-4 pb-5">
							{preferences.map(([label, value, Icon]) => {
								const PreferenceIcon = Icon as typeof CalendarDays;
								return (
									<div
										key={label as string}
										className="flex items-center gap-2 rounded-lg bg-muted/60 p-2.5"
									>
										<PreferenceIcon className="size-4 text-muted-foreground" />
										<span className="min-w-0 flex-1 text-xs">
											{label as string}
										</span>
										<span className="text-[11px] font-semibold text-muted-foreground">
											{value as string}
										</span>
									</div>
								);
							})}
						</CardContent>
					</Card>
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center gap-2 px-4 pb-2 pt-4">
							<Link className="size-4 text-primary" />
							<CardTitle className="text-sm">Connections</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 px-4 pb-5">
							{[
								["LinkedIn", "/in/alex-mercer"],
								["GitHub", "@amercer_code"],
								["Personal site", "alexmercer.space"],
							].map(([name, handle]) => (
								<Button
									key={name}
									variant="outline"
									className="h-10 w-full justify-between text-xs"
								>
									<span className="flex items-center gap-2">
										<Code2 className="size-3.5 text-primary" />
										{name}
										<span className="text-muted-foreground">{handle}</span>
									</span>
									<ExternalLink className="size-3" />
								</Button>
							))}
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
