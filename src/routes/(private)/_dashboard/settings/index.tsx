import { createFileRoute } from "@tanstack/react-router";
import {
	Bell,
	BookOpen,
	ChevronRight,
	CircleUserRound,
	Eye,
	LockKeyhole,
	Palette,
	Save,
	ShieldCheck,
	SlidersHorizontal,
	Timer,
} from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Switch } from "#/components/ui/switch.tsx";

export const Route = createFileRoute("/(private)/_dashboard/settings/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigation = [
		[CircleUserRound, "Account & Profile"],
		[SlidersHorizontal, "Study Preferences"],
		[Bell, "Notifications"],
		[Palette, "Appearance"],
		[ShieldCheck, "Data & Privacy"],
	];
	const preferences = [
		[Timer, "Pomodoro length", "25 minutes"],
		[BookOpen, "Default study view", "Weekly plan"],
		[Eye, "Show completed tasks", "Visible"],
	];

	return (
		<div className="w-full space-y-5">
			<section className="border-b border-border pb-5">
				<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
					Workspace
				</p>
				<h1 className="mt-1 text-2xl font-bold tracking-tight">Settings</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Manage your account, study preferences, and application experience.
				</p>
			</section>
			<div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
				<nav className="space-y-1">
					{navigation.map(([Icon, label], index) => {
						const NavigationIcon = Icon as typeof CircleUserRound;
						return (
							<Button
								key={label as string}
								variant={index === 0 ? "default" : "ghost"}
								className={`w-full justify-start gap-3 ${index === 0 ? "" : "text-muted-foreground"}`}
							>
								<NavigationIcon className="size-4" />
								{label as string}
								<ChevronRight className="ml-auto size-3" />
							</Button>
						);
					})}
				</nav>
				<main className="space-y-5">
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="border-b border-border/60 px-5 py-4">
							<CardTitle className="text-sm">Profile information</CardTitle>
							<p className="text-xs text-muted-foreground">
								Update your personal details and account identity.
							</p>
						</CardHeader>
						<CardContent className="space-y-6 p-5">
							<div className="flex flex-wrap items-center gap-4">
								<div className="flex size-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground ring-4 ring-primary/10">
									AM
								</div>
								<div>
									<p className="text-sm font-semibold">Alex Mercer</p>
									<p className="mt-1 text-xs text-muted-foreground">
										Junoir · Computer Science & Chemistry
									</p>
									<div className="mt-2 flex gap-2">
										<Button variant="outline" size="sm">
											Change avatar
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-destructive"
										>
											Remove
										</Button>
									</div>
								</div>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<label
									htmlFor="full-name"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									FULL NAME
									<Input id="full-name" defaultValue="Alex Mercer" />
								</label>
								<label
									htmlFor="email"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									EMAIL ADDRESS
									<Input
										id="email"
										type="email"
										defaultValue="alex@example.edu"
									/>
								</label>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<label
									htmlFor="major"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									PROGRAM
									<Input
										id="major"
										defaultValue="Computer Science & Chemistry"
									/>
								</label>
								<label
									htmlFor="timezone"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									TIME ZONE
									<Input
										id="timezone"
										defaultValue="Asia/Kathmandu (GMT+5:45)"
									/>
								</label>
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="px-5 pb-3 pt-5">
							<CardTitle className="text-sm">Study preferences</CardTitle>
							<p className="text-xs text-muted-foreground">
								Tune your workspace for focused study sessions.
							</p>
						</CardHeader>
						<CardContent className="space-y-2 px-5 pb-5">
							{preferences.map(([Icon, label, value]) => {
								const PreferenceIcon = Icon as typeof Timer;
								return (
									<div
										key={label as string}
										className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"
									>
										<PreferenceIcon className="size-4 text-primary" />
										<span className="flex-1 text-xs font-medium">
											{label as string}
										</span>
										<span className="text-xs text-muted-foreground">
											{value as string}
										</span>
										<ChevronRight className="size-3 text-muted-foreground" />
									</div>
								);
							})}
							<div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
								<Bell className="size-4 text-primary" />
								<div className="flex-1">
									<p className="text-xs font-medium">Daily study reminder</p>
									<p className="text-[11px] text-muted-foreground">
										Notify me at 8:00 AM
									</p>
								</div>
								<Switch defaultChecked />
							</div>
						</CardContent>
					</Card>

					<div className="grid gap-5 md:grid-cols-2">
						<Card className="rounded-xl border bg-primary/10 py-0 shadow-sm">
							<CardContent className="p-5">
								<p className="text-xs font-semibold text-primary">
									Scholar Pro
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									Billed annually · Next cycle: Oct 14, 2026
								</p>
								<Button className="mt-4" size="sm">
									Manage plan
								</Button>
							</CardContent>
						</Card>
						<Card className="rounded-xl border bg-card py-0 shadow-sm">
							<CardContent className="p-5">
								<div className="flex items-center gap-2">
									<LockKeyhole className="size-4 text-primary" />
									<p className="text-sm font-semibold">Security</p>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									Your password was updated 2 months ago.
								</p>
								<Button variant="outline" size="sm" className="mt-4">
									Change password
								</Button>
							</CardContent>
						</Card>
					</div>
					<div className="flex justify-end">
						<Button>
							<Save /> Save changes
						</Button>
					</div>
				</main>
			</div>
		</div>
	);
}
