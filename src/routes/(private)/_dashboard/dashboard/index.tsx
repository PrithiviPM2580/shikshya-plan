import { createFileRoute } from "@tanstack/react-router";
import StudyShell from "#/components/shared/study-shell";

export const Route = createFileRoute("/(private)/_dashboard/dashboard/")({
	component: RouteComponent,
});

function StatCard({
	title,
	value,
	note,
}: {
	title: string;
	value: string;
	note?: string;
}) {
	return (
		<div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
			<p className="text-sm font-semibold">{title}</p>
			<div className="mt-3 flex items-end gap-2">
				<h3 className="text-2xl font-bold">{value}</h3>
				{note && <span className="text-xs text-muted-foreground">{note}</span>}
			</div>
		</div>
	);
}

function ActivityItem({ title, time }: { title: string; time: string }) {
	return (
		<div className="flex items-start justify-between rounded-lg p-3 hover:bg-muted">
			<div>
				<p className="font-medium">{title}</p>
				<p className="text-xs text-muted-foreground">{time}</p>
			</div>
			<div className="text-xs text-muted-foreground">•</div>
		</div>
	);
}

function RouteComponent() {
	return (
		<StudyShell>
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<StatCard title="Total Hours" value="124" note="this month" />
					<StatCard title="Completed Tasks" value="18" note="this week" />
					<StatCard title="Active Projects" value="3" />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<div className="lg:col-span-2 rounded-3xl border border-border bg-surface p-6 shadow-sm">
						<h2 className="text-lg font-semibold">Recent Activity</h2>
						<div className="mt-4 space-y-2">
							<ActivityItem
								title="Finished: Algebra practice set"
								time="2h ago"
							/>
							<ActivityItem
								title="Marked: History notes reviewed"
								time="1d ago"
							/>
							<ActivityItem title="Added: Chemistry flashcards" time="2d ago" />
						</div>
					</div>

					<div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
						<h2 className="text-lg font-semibold">Upcoming Tasks</h2>
						<ul className="mt-4 space-y-3 text-sm text-muted-foreground">
							<li className="flex items-center justify-between">
								<span>Revise Physics chapter 4</span>
								<span className="text-xs">Due: Today</span>
							</li>
							<li className="flex items-center justify-between">
								<span>Practice SAT math</span>
								<span className="text-xs">Due: Tomorrow</span>
							</li>
							<li className="flex items-center justify-between">
								<span>Read Biology notes</span>
								<span className="text-xs">Due: 3d</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</StudyShell>
	);
}
