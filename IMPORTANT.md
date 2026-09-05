Think of it like layers that keep applying upward:

0px ------------------------------------------------------------>

default
📱 Phone

At 640px:

640px ---------------------------------------------------------->

sm:
📱 Large phone
📱 Small tablet

At 768px:

768px ---------------------------------------------------------->

md:
📱 Tablet
💻 Small laptop

At 1024px:

1024px --------------------------------------------------------->

lg:
💻 Laptop
🖥 Desktop

At 1280px:

1280px --------------------------------------------------------->

xl:
🖥 Large desktop

At 1536px:

1536px --------------------------------------------------------->

2xl:
🖥 Very large screens

The actual meaning:

0-639px
→ default styles

640px+
→ sm styles are available

768px+
→ md styles are available

1024px+
→ lg styles are available

1280px+
→ xl styles are available

1536px+
→ 2xl styles are available

The core application is working. Remaining work, in priority order:

1. **Task filters and sorting**
   - All, Due Soon, High Priority, Completed
   - Sort by due date, priority, and creation date

2. **Database-backed settings**
   - Move Pomodoro length, study view, completed-task visibility, and reminders from `localStorage` into `Profile`.

3. **Exam readiness**
   - Add readiness percentage.
   - Track syllabus topics or preparation tasks.
   - Show readiness on Exams and Dashboard.

4. **Notifications**
   - Persist notification preferences.
   - Add browser reminders for upcoming exams, tasks, and sessions.

5. **Avatar improvements**
   - Add Cloudinary image deletion when avatar is removed or replaced.
   - Optionally add crop/compression before upload.

6. **Calendar event creation**
   - The calendar displays events, but “New Event” is not yet implemented.
   - Add task/session/exam creation from the calendar.

7. **Pomodoro improvements**
   - Apply saved Pomodoro length from Settings.
   - Implement atmosphere/audio controls.
   - Add break cycles and automatic next session.

8. **Profile data model**
   - Store onboarding details explicitly:
     - Program
     - Semester
     - Weekly study hours
     - Target GPA
   - Currently some information is embedded in plan/goal text.

9. **Connections**
   - Store LinkedIn, GitHub, and personal website URLs per user instead of using generic links.

10. **Security and destructive actions**

- Add confirmation dialogs before deleting subjects, tasks, goals, plans, exams, and sessions.
- Add password reset flow.

12. **Production cleanup**

- Replace remaining static text such as Scholar Pro billing details.
- Add pagination for tasks, sessions, logs, and analytics.
- Improve error boundaries and loading states.
- Add database indexes for frequently queried dates and statuses.

The best next implementation should be **Task filters and sorting**, followed by **database-backed settings** and **exam readiness**.
