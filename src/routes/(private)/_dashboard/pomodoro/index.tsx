import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	ChevronRight,
	CirclePause,
	Coffee,
	Flame,
	Headphones,
	Play,
	RotateCcw,
	SkipForward,
	Volume2,
} from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";

export const Route = createFileRoute("/(private)/_dashboard/pomodoro/")({
	component: RouteComponent,
});

function RouteComponent() {
	const sessions = [
		{
			title: "Advanced Calculus Ch. 4",
			time: "09:00 AM - 09:25 AM",
			duration: "25m",
			icon: BookOpen,
			tone: "primary",
		},
		{
			title: "Data Structures Project",
			time: "10:00 AM - 10:25 AM",
			duration: "25m",
			icon: ChevronRight,
			tone: "secondary",
		},
		{
			title: "Data Structures Project",
			time: "10:30 AM - 10:55 AM",
			duration: "25m",
			icon: ChevronRight,
			tone: "secondary",
		},
		{
			title: "Literature Review",
			time: "11:15 AM (Interrupted)",
			duration: "12m",
			icon: CirclePause,
			tone: "destructive",
		},
	];
	const atmospheres = [
		{ name: "Rainy Library", icon: Headphones },
		{ name: "Cafe Focus", icon: Coffee, active: true },
		{ name: "Deep Woods", icon: Flame },
		{ name: "Cozy Fire", icon: Flame },
	];

	return (
		<div className="w-full">
			<div className="grid min-h-[calc(100vh-7rem)] gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
				<section className="flex flex-col items-center justify-center rounded-xl bg-muted/30 px-4 py-8">
					<div className="flex rounded-full bg-background p-1 shadow-sm">
						<Button variant="default" size="sm" className="rounded-full">
							Study Block
						</Button>
						<Button variant="ghost" size="sm" className="rounded-full">
							Short Break
						</Button>
						<Button variant="ghost" size="sm" className="rounded-full">
							Long Break
						</Button>
					</div>
					<div className="mt-10 flex size-64 items-center justify-center rounded-full border-8 border-primary/20 border-t-primary sm:size-72">
						<div className="text-center">
							<p className="text-6xl font-bold tracking-tight sm:text-7xl">
								25:00
							</p>
							<p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
								<span className="mr-1 inline-block size-1.5 rounded-full bg-primary" />
								Focusing
							</p>
						</div>
					</div>
					<div className="mt-8 flex items-center gap-5">
						<Button variant="ghost" size="icon-lg" aria-label="Reset timer">
							<RotateCcw />
						</Button>
						<Button size="icon-lg" className="size-14 rounded-full">
							<Play className="size-6" />
						</Button>
						<Button variant="ghost" size="icon-lg" aria-label="Skip session">
							<SkipForward />
						</Button>
					</div>
					<p className="mt-5 text-xs text-muted-foreground">
						Session 1 of 4 <span className="mx-2">·</span> Advanced Calculus Ch.
						4
					</p>
				</section>

				<aside className="space-y-5">
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center justify-between px-4 pb-3 pt-4">
							<CardTitle className="text-sm">Atmosphere</CardTitle>
							<Headphones className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent className="px-4 pb-5">
							<div className="grid grid-cols-2 gap-2">
								{atmospheres.map((atmosphere) => {
									const AtmosphereIcon = atmosphere.icon;
									return (
										<Button
											key={atmosphere.name}
											variant="ghost"
											className={`h-16 flex-col items-start justify-between rounded-lg border p-3 text-left ${atmosphere.active ? "border-primary bg-primary/10" : "bg-muted/60"}`}
										>
											<span className="flex w-full items-center justify-between">
												<AtmosphereIcon className="size-4 text-primary" />
												{atmosphere.active && (
													<span className="size-1.5 rounded-full bg-primary" />
												)}
											</span>
											<span className="text-xs">{atmosphere.name}</span>
										</Button>
									);
								})}
							</div>
							<div className="mt-5 flex items-center gap-3">
								<Volume2 className="size-4 text-muted-foreground" />
								<div className="h-1.5 flex-1 rounded-full bg-muted">
									<div className="h-full w-2/3 rounded-full bg-primary" />
								</div>
								<Volume2 className="size-4 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="flex-row items-center justify-between px-4 pb-3 pt-4">
							<CardTitle className="text-sm">Today's Sessions</CardTitle>
							<Badge variant="secondary">4 completed</Badge>
						</CardHeader>
						<CardContent className="space-y-2 px-4 pb-5">
							{sessions.map((session) => {
								const SessionIcon = session.icon;
								return (
									<div
										key={`${session.title}-${session.time}`}
										className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
									>
										<div
											className={`flex size-8 shrink-0 items-center justify-center rounded-full ${session.tone === "destructive" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
										>
											<SessionIcon className="size-4" />
										</div>
										<div className="min-w-0 flex-1">
											<p className="truncate text-xs font-semibold">
												{session.title}
											</p>
											<p className="mt-1 text-[10px] text-muted-foreground">
												{session.time}
											</p>
										</div>
										<span className="whitespace-nowrap text-xs font-bold text-muted-foreground">
											{session.duration}
										</span>
									</div>
								);
							})}
						</CardContent>
					</Card>
					<Card className="rounded-xl border-0 bg-primary/10 py-0 shadow-sm">
						<CardContent className="flex gap-3 p-4">
							<Flame className="mt-0.5 size-4 shrink-0 text-primary" />
							<div>
								<p className="text-xs font-semibold text-primary">
									Focus streak
								</p>
								<p className="mt-1 text-[11px] leading-4 text-muted-foreground">
									Keep going. You are on a 14-day study streak.
								</p>
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
