import { useEffect } from "react";

type Reminder = {
	id: string;
	title: string;
	dueAt: Date | string | null;
};

type NotificationRemindersProps = {
	preferences: {
		tasks: boolean;
		exams: boolean;
		sessions: boolean;
	};
	reminders: {
		tasks: Reminder[];
		exams: Reminder[];
		sessions: Reminder[];
	};
};

const reminderLeadTime = 15 * 60 * 1000;

export default function NotificationReminders({
	preferences,
	reminders,
}: NotificationRemindersProps) {
	useEffect(() => {
		if (!("Notification" in window) || Notification.permission !== "granted") {
			return;
		}

		const timers = Object.entries(reminders).flatMap(([kind, entries]) => {
			if (!preferences[kind as keyof typeof preferences]) return [];

			return entries.map((reminder) => {
				if (!reminder.dueAt) return null;
				const dueAt = new Date(reminder.dueAt).getTime();
				const notificationKey = `study-reminder:${kind}:${reminder.id}`;
				const notifyAt = Math.max(Date.now(), dueAt - reminderLeadTime);
				const delay = notifyAt - Date.now();
				if (sessionStorage.getItem(notificationKey) || delay > 2_147_000_000) {
					return null;
				}

				return window.setTimeout(() => {
					if (sessionStorage.getItem(notificationKey)) return;
					sessionStorage.setItem(notificationKey, "sent");
					new Notification(reminder.title, {
						body: `${kind.slice(0, -1)} starts soon`,
						tag: notificationKey,
					});
				}, delay);
			});
		});

		return () => {
			for (const timer of timers) {
				if (timer !== null) window.clearTimeout(timer);
			}
		};
	}, [preferences, reminders]);

	return null;
}
