import {
	createFileRoute,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
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
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "#/components/theme-provider";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Switch } from "#/components/ui/switch.tsx";
import {
	getProfile,
	updateProfile,
	uploadAvatar,
} from "#/features/profile/server/profile";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/(private)/_dashboard/settings/")({
	loader: () => getProfile(),
	component: RouteComponent,
});

function RouteComponent() {
	const profileData = Route.useLoaderData();
	const persistedStudyView = profileData.profile?.studyView;
	const router = useRouter();
	const navigate = useNavigate();
	const { setTheme } = useTheme();
	const [name, setName] = useState(
		profileData.profile?.name ?? profileData.user.name,
	);
	const [program, setProgram] = useState(profileData.profile?.program ?? "");
	const [semester, setSemester] = useState(
		profileData.profile?.semester ?? "",
	);
	const [weeklyHours, setWeeklyHours] = useState(
		String(profileData.profile?.weeklyHours ?? ""),
	);
	const [targetGpa, setTargetGpa] = useState(
		String(profileData.profile?.targetGpa ?? ""),
	);
	const [avatarUrl, setAvatarUrl] = useState(
		profileData.profile?.avatarUrl ?? profileData.user.image ?? null,
	);
	const [passwordOpen, setPasswordOpen] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [activeSection, setActiveSection] = useState("account");
	const [theme, setThemeValue] = useState(
		profileData.profile?.theme ?? "SYSTEM",
	);
	const [reminders, setReminders] = useState(
		profileData.profile?.reminders ?? true,
	);
	const [taskReminders, setTaskReminders] = useState(
		profileData.profile?.taskReminders ?? true,
	);
	const [examReminders, setExamReminders] = useState(
		profileData.profile?.examReminders ?? true,
	);
	const [sessionReminders, setSessionReminders] = useState(
		profileData.profile?.sessionReminders ?? true,
	);
	const [saving, setSaving] = useState(false);
	const [avatarUploading, setAvatarUploading] = useState(false);
	const [pomodoroLength, setPomodoroLength] = useState(
		String(profileData.profile?.pomodoroLength ?? 25),
	);
	const [studyView, setStudyView] = useState<
		"weekly" | "calendar" | "sessions"
	>(
		persistedStudyView === "calendar" ||
			persistedStudyView === "sessions" ||
			persistedStudyView === "weekly"
			? persistedStudyView
			: "weekly",
	);
	const [showCompleted, setShowCompleted] = useState(
		profileData.profile?.showCompletedTasks ?? true,
	);

	async function saveSettings() {
		setSaving(true);
		try {
			await updateProfile({
				data: {
					name,
					program: program || null,
					semester: semester || null,
					weeklyHours: weeklyHours === "" ? null : Number(weeklyHours),
					targetGpa: targetGpa === "" ? null : Number(targetGpa),
					theme,
					avatarUrl,
					pomodoroLength,
					studyView,
					showCompletedTasks: showCompleted,
					reminders,
					taskReminders,
					examReminders,
					sessionReminders,
				},
			});
			setTheme(theme.toLowerCase() as "system" | "light" | "dark");
			await router.invalidate();
			toast.success("Settings saved");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save settings",
			);
		} finally {
			setSaving(false);
		}
	}

	async function enableBrowserNotifications() {
		if (!("Notification" in window)) {
			toast.error("This browser does not support notifications");
			return;
		}
		const permission = await Notification.requestPermission();
		toast[permission === "granted" ? "success" : "error"](
			permission === "granted"
				? "Browser reminders enabled"
				: "Browser reminders were not enabled",
		);
	}

	async function handleAvatar(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/") || file.size > 5_000_000) {
			toast.error("Choose an image smaller than 5 MB");
			return;
		}
		setAvatarUploading(true);
		try {
			const dataUrl = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () =>
					typeof reader.result === "string"
						? resolve(reader.result)
						: reject(new Error("Unable to read image"));
				reader.onerror = () => reject(new Error("Unable to read image"));
				reader.readAsDataURL(file);
			});
			const result = await uploadAvatar({ data: { dataUrl } });
			setAvatarUrl(result.secureUrl);
			toast.success("Avatar uploaded. Save changes to keep it.");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to upload avatar",
			);
		} finally {
			setAvatarUploading(false);
		}
	}

	function goToSection(section: string) {
		setActiveSection(section);
		document
			.getElementById(section)
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	async function changePassword(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (newPassword !== confirmPassword) {
			toast.error("New passwords do not match");
			return;
		}
		await authClient.changePassword({
			newPassword,
			currentPassword,
			revokeOtherSessions: true,
			fetchOptions: {
				onSuccess: () => {
					toast.success("Password changed");
					setPasswordOpen(false);
					setCurrentPassword("");
					setNewPassword("");
					setConfirmPassword("");
				},
				onError: (context) => {
					toast.error(context.error.message);
				},
			},
		});
	}
	const navigation = [
		[CircleUserRound, "Account & Profile"],
		[SlidersHorizontal, "Study Preferences"],
		[Bell, "Notifications"],
		[Palette, "Appearance"],
		[ShieldCheck, "Data & Privacy"],
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
								variant={
									activeSection ===
									[
										"account",
										"preferences",
										"notifications",
										"appearance",
										"privacy",
									][index]
										? "default"
										: "ghost"
								}
								onClick={() =>
									goToSection(
										[
											"account",
											"preferences",
											"notifications",
											"appearance",
											"privacy",
										][index],
									)
								}
								className="w-full justify-start gap-3"
							>
								<NavigationIcon className="size-4" />
								{label as string}
								<ChevronRight className="ml-auto size-3" />
							</Button>
						);
					})}
				</nav>
				<main className="space-y-5">
					<Card
						id="account"
						className="scroll-mt-5 rounded-xl border bg-card py-0 shadow-sm"
					>
						<CardHeader className="border-b border-border/60 px-5 py-4">
							<CardTitle className="text-sm">Profile information</CardTitle>
							<p className="text-xs text-muted-foreground">
								Update your personal details and account identity.
							</p>
						</CardHeader>
						<CardContent className="space-y-6 p-5">
							<div className="flex flex-wrap items-center gap-4">
								<div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-primary text-xl font-bold text-primary-foreground ring-4 ring-primary/10">
									{avatarUrl ? (
										<img
											src={avatarUrl}
											alt="Profile avatar"
											className="size-full object-cover"
										/>
									) : (
										name
											.split(" ")
											.map((part) => part[0])
											.join("")
											.slice(0, 2)
											.toUpperCase()
									)}
								</div>
								<div>
									<p className="text-sm font-semibold">{name}</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{profileData.user.email}
									</p>
									<div className="mt-2 flex gap-2">
										<label className="inline-flex h-8 cursor-pointer items-center rounded-md border border-input bg-background px-3 text-xs shadow-xs hover:bg-accent">
											Change avatar
											{avatarUploading && "Uploading..."}
											<input
												type="file"
												accept="image/png,image/jpeg,image/webp"
												className="sr-only"
												onChange={handleAvatar}
											/>
										</label>
										<Button
											variant="ghost"
											size="sm"
											className="text-destructive"
											onClick={() => setAvatarUrl(null)}
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
									<Input
										id="full-name"
										value={name}
										onChange={(event) => setName(event.target.value)}
									/>
								</label>
								<label
									htmlFor="email"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									EMAIL ADDRESS
									<Input
										id="email"
										type="email"
										value={profileData.user.email}
										readOnly
									/>
								</label>
								<label
									htmlFor="theme"
									id="appearance"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									THEME
									<select
										id="theme"
										value={theme}
										onChange={(event) =>
											setThemeValue(event.target.value as typeof theme)
										}
										className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground"
									>
										<option value="SYSTEM">System</option>
										<option value="LIGHT">Light</option>
										<option value="DARK">Dark</option>
									</select>
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
										value={program}
										onChange={(event) => setProgram(event.target.value)}
										placeholder="e.g. BCA"
									/>
								</label>
								<label
									htmlFor="semester"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									SEMESTER
									<Input
										id="semester"
										value={semester}
										onChange={(event) => setSemester(event.target.value)}
										placeholder="e.g. Semester 4"
									/>
								</label>
								<label
									htmlFor="timezone"
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									TIME ZONE
									<Input
										id="timezone"
										value={Intl.DateTimeFormat().resolvedOptions().timeZone}
										readOnly
									/>
								</label>
								<label
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									WEEKLY STUDY HOURS
									<Input
										type="number"
										min="0"
										max="168"
										value={weeklyHours}
										onChange={(event) => setWeeklyHours(event.target.value)}
										placeholder="15"
									/>
								</label>
								<label
									className="space-y-2 text-xs font-medium text-muted-foreground"
								>
									TARGET GPA
									<Input
										type="number"
										min="0"
										max="4"
										step="0.1"
										value={targetGpa}
										onChange={(event) => setTargetGpa(event.target.value)}
										placeholder="3.8"
									/>
								</label>
							</div>
						</CardContent>
					</Card>

					<Card
						id="preferences"
						className="scroll-mt-5 rounded-xl border bg-card py-0 shadow-sm"
					>
						<CardHeader className="px-5 pb-3 pt-5">
							<CardTitle className="text-sm">Study preferences</CardTitle>
							<p className="text-xs text-muted-foreground">
								Tune your workspace for focused study sessions.
							</p>
						</CardHeader>
						<CardContent className="space-y-2 px-5 pb-5">
							<label className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
								<Timer className="size-4 text-primary" />
								<span className="flex-1 text-xs font-medium">
									Pomodoro length
								</span>
								<select
									value={pomodoroLength}
									onChange={(event) => setPomodoroLength(event.target.value)}
									className="h-8 rounded-md border border-input bg-background px-2 text-xs"
								>
									<option value="15">15 minutes</option>
									<option value="25">25 minutes</option>
									<option value="50">50 minutes</option>
								</select>
							</label>
							<label className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
								<BookOpen className="size-4 text-primary" />
								<span className="flex-1 text-xs font-medium">
									Default study view
								</span>
								<select
									value={studyView}
									onChange={(event) =>
										setStudyView(event.target.value as typeof studyView)
									}
									className="h-8 rounded-md border border-input bg-background px-2 text-xs"
								>
									<option value="weekly">Weekly plan</option>
									<option value="calendar">Calendar</option>
									<option value="sessions">Sessions</option>
								</select>
							</label>
							<div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
								<Eye className="size-4 text-primary" />
								<span className="flex-1 text-xs font-medium">
									Show completed tasks
								</span>
								<Switch
									checked={showCompleted}
									onCheckedChange={setShowCompleted}
								/>
							</div>
							<div
								id="notifications"
								className="scroll-mt-5 space-y-3 rounded-lg bg-muted/60 p-3"
							>
								<div className="flex items-center gap-3">
									<Bell className="size-4 text-primary" />
									<div className="flex-1">
										<p className="text-xs font-medium">Daily study reminder</p>
										<p className="text-[11px] text-muted-foreground">
											Notify me at 8:00 AM
										</p>
									</div>
									<Switch checked={reminders} onCheckedChange={setReminders} />
								</div>
								<NotificationSwitch
									label="Task reminders"
									checked={taskReminders}
									onCheckedChange={setTaskReminders}
								/>
								<NotificationSwitch
									label="Exam reminders"
									checked={examReminders}
									onCheckedChange={setExamReminders}
								/>
								<NotificationSwitch
									label="Study session reminders"
									checked={sessionReminders}
									onCheckedChange={setSessionReminders}
								/>
								<Button
									variant="outline"
									size="sm"
									onClick={enableBrowserNotifications}
									className="w-full"
								>
									Enable browser reminders
								</Button>
							</div>
						</CardContent>
					</Card>

					<div className="grid gap-5 md:grid-cols-2">
						<Card className="rounded-xl border bg-primary/10 py-0 shadow-sm">
							<CardContent className="p-5">
								<p className="text-xs font-semibold text-primary">
									Study workspace
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									Your study tools, plans, and progress in one place.
								</p>
								<Button
									className="mt-4"
									size="sm"
									onClick={() => navigate({ to: "/plans" })}
								>
									Manage study plans
								</Button>
							</CardContent>
						</Card>
						<Card
							id="privacy"
							className="scroll-mt-5 rounded-xl border bg-card py-0 shadow-sm"
						>
							<CardContent className="p-5">
								<div className="flex items-center gap-2">
									<LockKeyhole className="size-4 text-primary" />
									<p className="text-sm font-semibold">Security</p>
								</div>
								<p className="mt-2 text-xs text-muted-foreground">
									Your password was updated 2 months ago.
								</p>
								<Button
									variant="outline"
									size="sm"
									className="mt-4"
									onClick={() => setPasswordOpen((value) => !value)}
								>
									Change password
								</Button>
								{passwordOpen && (
									<form onSubmit={changePassword} className="mt-4 space-y-2">
										<Input
											required
											type="password"
											value={currentPassword}
											onChange={(event) =>
												setCurrentPassword(event.target.value)
											}
											placeholder="Current password"
										/>
										<Input
											required
											minLength={8}
											type="password"
											value={newPassword}
											onChange={(event) => setNewPassword(event.target.value)}
											placeholder="New password (8+ characters)"
										/>
										<Input
											required
											minLength={8}
											type="password"
											value={confirmPassword}
											onChange={(event) =>
												setConfirmPassword(event.target.value)
											}
											placeholder="Confirm new password"
										/>
										<Button type="submit" size="sm">
											Update password
										</Button>
									</form>
								)}
							</CardContent>
						</Card>
					</div>
					<div className="flex justify-end">
						<Button onClick={saveSettings} disabled={saving}>
							<Save /> Save changes
						</Button>
					</div>
				</main>
			</div>
		</div>
	);
}

function NotificationSwitch({
	label,
	checked,
	onCheckedChange,
}: {
	label: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-between border-t border-border/60 pt-2">
			<span className="text-xs text-muted-foreground">{label}</span>
			<Switch checked={checked} onCheckedChange={onCheckedChange} />
		</div>
	);
}
