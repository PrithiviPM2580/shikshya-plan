import { createFileRoute, useRouter } from "@tanstack/react-router";
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
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "#/components/theme-provider";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { getProfile, updateProfile } from "#/features/profile/server/profile";

export const Route = createFileRoute("/(private)/_dashboard/profile/")({
	loader: () => getProfile(),
	component: RouteComponent,
});

function RouteComponent() {
	const profileData = Route.useLoaderData();
	const router = useRouter();
	const { setTheme } = useTheme();
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(
		profileData.profile?.name ?? profileData.user.name,
	);
	const [theme, setThemeValue] = useState(
		profileData.profile?.theme ?? "SYSTEM",
	);
	const [linkedinUrl, setLinkedinUrl] = useState(
		profileData.profile?.linkedinUrl ?? "",
	);
	const [githubUrl, setGithubUrl] = useState(
		profileData.profile?.githubUrl ?? "",
	);
	const [websiteUrl, setWebsiteUrl] = useState(
		profileData.profile?.websiteUrl ?? "",
	);
	const [avatarUrl] = useState(
		profileData.profile?.avatarUrl ?? profileData.user.image ?? null,
	);
	const [saving, setSaving] = useState(false);
	const displayName = profileData.profile?.name ?? profileData.user.name;
	const initials = displayName
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
	async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		try {
			await updateProfile({
				data: {
					name,
					theme,
					avatarUrl,
					linkedinUrl: linkedinUrl || null,
					githubUrl: githubUrl || null,
					websiteUrl: websiteUrl || null,
					pomodoroLength: profileData.profile?.pomodoroLength ?? 25,
					studyView:
						profileData.profile?.studyView === "calendar" ||
						profileData.profile?.studyView === "sessions"
							? profileData.profile.studyView
							: "weekly",
					showCompletedTasks: profileData.profile?.showCompletedTasks ?? true,
					reminders: profileData.profile?.reminders ?? true,
					taskReminders: profileData.profile?.taskReminders ?? true,
					examReminders: profileData.profile?.examReminders ?? true,
					sessionReminders: profileData.profile?.sessionReminders ?? true,
				},
			});
			setTheme(theme.toLowerCase() as "system" | "light" | "dark");
			setEditing(false);
			await router.invalidate();
			toast.success("Profile updated");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update profile",
			);
		} finally {
			setSaving(false);
		}
	}
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
				<Button onClick={() => setEditing((value) => !value)}>
					<PenLine /> Edit Profile
				</Button>
			</section>
			{editing && (
				<form
					onSubmit={saveProfile}
					className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2"
				>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Display name</span>
						<Input
							required
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">Theme</span>
						<select
							value={theme}
							onChange={(event) =>
								setThemeValue(event.target.value as typeof theme)
							}
							className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
						>
							<option value="SYSTEM">System</option>
							<option value="LIGHT">Light</option>
							<option value="DARK">Dark</option>
						</select>
					</label>
					<Button type="submit" disabled={saving}>
						{saving ? "Saving..." : "Save"}
					</Button>
					<label className="space-y-1 text-sm">
						<span className="font-medium">LinkedIn URL</span>
						<Input
							value={linkedinUrl}
							onChange={(event) => setLinkedinUrl(event.target.value)}
							placeholder="https://linkedin.com/in/you"
							type="url"
						/>
					</label>
					<label className="space-y-1 text-sm">
						<span className="font-medium">GitHub URL</span>
						<Input
							value={githubUrl}
							onChange={(event) => setGithubUrl(event.target.value)}
							placeholder="https://github.com/you"
							type="url"
						/>
					</label>
					<label className="space-y-1 text-sm sm:col-span-2">
						<span className="font-medium">Personal website URL</span>
						<Input
							value={websiteUrl}
							onChange={(event) => setWebsiteUrl(event.target.value)}
							placeholder="https://your-site.com"
							type="url"
						/>
					</label>
				</form>
			)}

			<Card className="overflow-hidden rounded-xl border bg-card py-0 shadow-sm">
				<CardContent className="grid gap-6 p-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-center lg:p-7">
					<div className="flex items-center gap-4 lg:border-r lg:border-border/60 lg:pr-6">
						<div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground ring-4 ring-primary/10">
							{initials}
						</div>
						<div>
							<p className="text-sm font-bold">{displayName}</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{profileData.user.email}
							</p>
							<p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
								<MapPin className="size-3" /> Kathmandu, Nepal
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						<div className="rounded-lg bg-muted/60 p-3 text-center">
							<GraduationCap className="mx-auto size-4 text-primary" />
							<p className="mt-2 text-lg font-bold">-</p>
							<p className="text-[10px] uppercase text-muted-foreground">
								Overall GPA
							</p>
						</div>
						<div className="rounded-lg bg-muted/60 p-3 text-center">
							<Timer className="mx-auto size-4 text-primary" />
							<p className="mt-2 text-lg font-bold">
								{Math.round((profileData.studyMinutes / 60) * 10) / 10}h
							</p>
							<p className="text-[10px] uppercase text-muted-foreground">
								Study hours
							</p>
						</div>
						<div className="rounded-lg bg-muted/60 p-3 text-center">
							<CheckCircle2 className="mx-auto size-4 text-primary" />
							<p className="mt-2 text-lg font-bold">
								{profileData.masteredSubjects}
							</p>
							<p className="text-[10px] uppercase text-muted-foreground">
								Mastered
							</p>
						</div>
						<div className="rounded-lg bg-muted/60 p-3 text-center">
							<Flame className="mx-auto size-4 text-primary" />
							<p className="mt-2 text-lg font-bold">{profileData.streak}d</p>
							<p className="text-[10px] uppercase text-muted-foreground">
								Current streak
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
				<main className="space-y-5">
					<Card className="rounded-xl border bg-card py-0 shadow-sm">
						<CardHeader className="px-5 pb-2 pt-5">
							<CardTitle className="flex items-center gap-2 text-sm">
								<GraduationCap className="size-4 text-primary" /> Academic
								details
							</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
							<AcademicDetail
								label="Program"
								value={profileData.profile?.program}
							/>
							<AcademicDetail
								label="Semester"
								value={profileData.profile?.semester}
							/>
							<AcademicDetail
								label="Weekly study target"
								value={
									profileData.profile?.weeklyHours == null
										? undefined
										: `${profileData.profile.weeklyHours} hours`
								}
							/>
							<AcademicDetail
								label="Target GPA"
								value={
									profileData.profile?.targetGpa == null
										? undefined
										: profileData.profile.targetGpa.toFixed(1)
								}
							/>
						</CardContent>
					</Card>
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
								["LinkedIn", profileData.profile?.linkedinUrl],
								["GitHub", profileData.profile?.githubUrl],
								["Personal site", profileData.profile?.websiteUrl],
							].map(([name, url]) =>
								url ? (
									<a
										key={name}
										href={url}
										target="_blank"
										rel="noreferrer"
										className="inline-flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
									>
										<span className="flex min-w-0 items-center gap-2">
											<Code2 className="size-3.5 shrink-0 text-primary" />
											{name}
											<span className="truncate text-muted-foreground">
												{url}
											</span>
										</span>
										<ExternalLink className="size-3 shrink-0" />
									</a>
								) : null,
							)}
							{![
								profileData.profile?.linkedinUrl,
								profileData.profile?.githubUrl,
								profileData.profile?.websiteUrl,
							].some(Boolean) && (
								<p className="text-xs text-muted-foreground">
									No connections added yet.
								</p>
							)}
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}

function AcademicDetail({
	label,
	value,
}: {
	label: string;
	value: string | null | undefined;
}) {
	return (
		<div className="rounded-lg bg-muted/60 p-3">
			<p className="text-[10px] uppercase tracking-wide text-muted-foreground">
				{label}
			</p>
			<p className="mt-1 text-sm font-semibold">{value ?? "Not set"}</p>
		</div>
	);
}
