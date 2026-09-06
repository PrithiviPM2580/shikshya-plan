# Shikshya Plan

## Project Details and Supervisor Explanation Guide

## 1. Project Overview

Shikshya Plan is a web-based study planning and academic productivity platform. It helps students organize subjects, study plans, sessions, tasks, exams, goals, and study progress in one application.

The project also includes AI-powered tools that help students generate study plans, break large goals into smaller tasks, ask academic questions, create quizzes, analyze exam readiness, and receive recommendations based on their study activity.

### Short Introduction

> Shikshya Plan is an AI-powered academic productivity platform that helps students plan their studies, manage academic tasks, track progress, and receive personalized study guidance from one secure dashboard.

---

## 2. Problem the Project Solves

Students often manage their academic work using separate notes, calendars, reminders, and documents. This can make it difficult to:

- Organize tasks and subjects in one place
- Prioritize exam preparation
- Maintain a regular study routine
- Track actual study progress
- Recover after missing planned study sessions
- Decide what to study next

Shikshya Plan solves this problem by combining academic organization, progress tracking, and AI assistance in a single platform.

---

## 3. Main Objectives

- Create a centralized academic planning system.
- Allow students to manage subjects, plans, sessions, tasks, exams, and goals.
- Track study time and completion progress.
- Provide personalized AI-generated study assistance.
- Support better planning and more consistent study habits.
- Protect student data through authentication and user-owned records.

---

## 4. How the System Works

1. A user creates an account or signs in using email, Google, or GitHub.
2. A new user completes onboarding by selecting academic information and preferences.
3. The user creates subjects, plans, study sessions, tasks, exams, and goals.
4. The user records completed study sessions and study time.
5. The dashboard displays current tasks, goals, reminders, and progress.
6. The AI Study Coach uses user requests and relevant academic data to generate guidance.
7. The user reviews AI results and saves useful plans or tasks.
8. Analytics help the student understand study consistency and areas needing attention.

---

## 5. Implemented Features

### 5.1 User Authentication

The system supports secure user access through:

- Email and password sign-up
- Email and password sign-in
- Google authentication
- GitHub authentication
- Protected dashboard routes
- Password recovery and password reset

New or incomplete accounts are sent to onboarding. Completed accounts are sent to the dashboard.

### 5.2 Onboarding

The onboarding workflow collects important academic information before the user enters the main dashboard. It helps configure the student profile, academic program, semester, courses, and initial preferences.

### 5.3 Profile and Settings

Students can manage:

- Name and academic information
- Program and semester
- Weekly study target
- Target GPA
- Pomodoro duration
- Study view preferences
- Reminder preferences
- Theme and other settings

### 5.4 Subject Management

Students can create and manage subjects. Subjects can be connected to:

- Study plans
- Study sessions
- Tasks
- Exams
- Study logs
- Pomodoro sessions
- Analytics

### 5.5 Study Plan Management

Students can create study plans with:

- Plan title
- Description
- Goal
- Start date
- End date
- Status
- Related subjects

Plans can be active, completed, or archived.

### 5.6 Study Session Management

Students can schedule study sessions by entering:

- Session title
- Subject
- Study plan
- Scheduled date
- Duration
- Notes

Sessions can be marked as completed, and completed sessions can create study logs.

### 5.7 Task Management

The task system allows students to:

- Create tasks
- Add descriptions
- Assign subjects
- Set due dates
- Set low, medium, or high priority
- Mark tasks as completed
- Edit tasks
- Delete tasks
- Filter and sort tasks
- Browse tasks using pagination

### 5.8 Exam and Goal Tracking

Students can record exams with:

- Exam title
- Subject
- Exam date
- Syllabus
- Readiness percentage
- Completion status

Students can also create goals with targets, deadlines, progress values, and completion status.

### 5.9 Analytics and Progress Monitoring

The analytics area uses study records to display:

- Total study hours
- Daily study consistency
- Subject study distribution
- Study activity heatmap
- Task completion rate
- Pomodoro completion rate
- Study streak
- Weekly target pace
- Focus recommendations

### 5.10 Pomodoro Study Timer

The Pomodoro feature helps students study in focused time blocks. It stores Pomodoro sessions, focus duration, completion state, subject, and start/end information.

### 5.11 Calendar and Reminders

The application provides calendar-based views for academic activities. Browser reminders can notify students about relevant tasks, exams, and sessions when permission is granted.

Students can control reminder preferences in settings.

### 5.12 AI Study Plan Generator

The student enters a study focus and selects a plan duration. The AI generates:

- A study plan title
- An overview
- Daily focus areas
- Tasks for each day
- Task duration
- Task priority

The student can select the tasks to save and optionally associate them with a subject.

### 5.13 AI Task Breakdown

The student enters a large goal, such as preparing for an exam or completing an assignment. The AI converts it into smaller actionable tasks with:

- Task title
- Estimated duration
- Priority
- A short overview

Selected tasks can be saved to the task system.

### 5.14 AI Exam Readiness Insights

The AI analyzes an upcoming exam using available exam details, readiness, related tasks, and study activity. It returns:

- Readiness summary
- Priority level
- Recommended next actions
- Topics that need focus

### 5.15 AI Tutor

The AI Tutor allows students to ask academic questions. It returns:

- A direct explanation
- Important key points
- A practical example
- Follow-up questions

The student can optionally select a subject to provide additional context.

### 5.16 AI Quiz Generator

The student enters a topic and requests a practice quiz. The system generates multiple-choice questions with:

- Four answer options
- One correct answer
- Explanation for the answer

The interface lets students answer the questions and review the explanations.

### 5.17 Natural-Language Task Creation

Students can describe a task using normal language, for example:

> Finish chapter 3 of Database Systems tomorrow with high priority.

The AI extracts useful task details such as:

- Task title
- Description
- Due date
- Priority
- Subject name

The task is then created in the user’s task list.

### 5.18 Smart Schedule Adjustment

When tasks or study sessions are unfinished, the student can request a recovery plan for 3, 5, or 7 days.

The AI uses unfinished work, priorities, dates, subjects, and the weekly study target to suggest:

- A daily recovery schedule
- Daily focus areas
- Task duration
- Task priority

The result is shown for review and does not automatically change stored tasks.

### 5.19 AI Study Analytics Summary

The student can select a 7, 15, or 30-day period. The AI analyzes real activity data and produces:

- A progress headline
- A study pattern summary
- Observations from the data
- Recommended next steps

The summary can use study hours, active days, subject distribution, task completion, Pomodoro completion, weekly targets, and target GPA.

---

## 6. Technology Used

### Frontend

- React
- TypeScript
- TanStack Start
- TanStack Router
- Tailwind CSS
- Lucide React icons

### Backend and Application Framework

- TanStack Start server functions
- Better Auth
- Vite
- Bun

### Database

- PostgreSQL
- Prisma ORM
- Generated Prisma client

### AI

- Vercel AI SDK
- OpenRouter AI provider
- Structured Zod schemas for validating AI responses

### Development Tools

- Biome for linting and formatting
- Vitest for testing
- Prisma commands for database generation and management

---

## 7. Main Database Entities

The database contains relationships between the following main entities:

- User
- Profile
- Subject
- Study Plan
- Study Session
- Task
- Exam
- Goal
- Study Log
- Pomodoro Session
- Authentication Session
- Authentication Account

A user owns their academic records, so each user sees their own subjects, tasks, plans, exams, goals, sessions, and analytics.

---

## 8. Simple Architecture Explanation

```text
Student
   |
   v
React Dashboard
   |
   v
TanStack Router and Server Functions
   |
   +--> Better Auth
   |
   +--> Prisma ORM --> PostgreSQL Database
   |
   +--> AI SDK --> OpenRouter Models
   |
   v
Plans, Tasks, Sessions, Exams, Analytics, and AI Recommendations
```

### Technical Flow

1. The student interacts with a React page.
2. TanStack Router loads the required route and page data.
3. Server functions validate the request and verify the current user.
4. Prisma reads or writes the user’s records in PostgreSQL.
5. AI features send controlled, structured prompts to the configured AI provider.
6. Zod schemas validate the AI response before it reaches the interface.
7. The result is displayed as a plan, insight, explanation, quiz, task, or recommendation.

---

## 9. What Makes the Project Useful

- It combines academic planning and productivity tools in one application.
- It gives students a structured way to organize their work.
- It connects tasks and sessions to subjects and study plans.
- It shows progress using actual study records.
- It provides AI assistance for planning and academic understanding.
- It supports schedule recovery when planned work is missed.
- It allows students to review AI-generated results before saving them.

---

## 10. Example Explanation to Give a Supervisor

> My project is Shikshya Plan, an AI-powered study planning and academic productivity platform. The main purpose is to help students manage their academic activities from one dashboard. A student can create subjects, study plans, study sessions, tasks, exams, and goals. The application records study activity and presents analytics such as study hours, completion rates, subject distribution, and study streaks. I also integrated AI features that generate study plans, break large goals into tasks, analyze exam readiness, answer academic questions, generate quizzes, create tasks from natural language, adjust missed schedules, and summarize study analytics. The system uses React and TypeScript on the frontend, TanStack Start for application and server functions, PostgreSQL with Prisma for data storage, Better Auth for authentication, and the Vercel AI SDK with OpenRouter for AI features.

---

## 11. Common Supervisor Questions and Answers

### Why did you choose this project?

> Students need more than a simple task list. They need help organizing subjects, exams, study sessions, and progress. This project combines those needs in one platform and adds AI assistance for personalization.

### What is the main innovation?

> The main innovation is the combination of structured academic management with AI-powered study assistance. The AI does not only generate text; it creates structured plans, tasks, quizzes, insights, and recommendations that connect to the student’s study data.

### How is user data protected?

> Authentication is handled with Better Auth. Protected server functions verify the current user, and database queries filter records by the authenticated user ID. This prevents users from accessing another user’s academic data.

### Why did you use Prisma?

> Prisma provides a type-safe way to work with PostgreSQL and makes relationships between users, subjects, plans, sessions, tasks, exams, and logs easier to manage.

### Why did you use an AI SDK?

> The AI SDK provides a structured way to call AI models and validate generated output. Zod schemas ensure that the AI returns the expected fields instead of unstructured or unsafe data.

### Does the AI automatically change the student’s schedule?

> The schedule adjustment feature currently creates a recommendation for review. It does not automatically modify stored tasks, which gives the student control over the final schedule.

### What happens when a user misses a study session?

> The student can request a recovery plan. The system collects unfinished tasks and sessions, sends relevant information to the AI, and displays a manageable plan for the selected number of days.

### What happens for a new social-login user?

> A new or incomplete account is redirected to onboarding. After the profile is complete, the user can access the dashboard. Existing completed accounts go directly to the dashboard.

### What are the main limitations?

> AI output depends on the configured model and API availability. The current schedule adjustment is recommendation-only, and the project still needs broader real-user testing before production deployment.

### What can be improved in the future?

> Future work could include calendar synchronization, note-based tutoring, AI conversation history, automatic schedule updates after user approval, mobile support, more testing, and deployment monitoring.

---

## 12. Demo Flow for Presentation

Use this order when demonstrating the project:

1. Show the sign-in page and explain authentication.
2. Sign in with the demo account or a test account.
3. Show the dashboard overview.
4. Open subjects and show the subject records.
5. Open tasks and demonstrate filtering, priority, completion, or pagination.
6. Open the calendar or sessions page and show scheduled study work.
7. Open exams or goals and show academic progress data.
8. Open analytics and explain study activity metrics.
9. Open AI Study Coach and generate a short study plan.
10. Demonstrate one AI tool, such as the AI Tutor or quiz generator.
11. Show how generated tasks can be reviewed and saved.
12. Finish by explaining how the project supports planning, studying, tracking, and improvement.

### Demo Account

- Email: `demo@shikshyaplan.com`
- Password: `Demo@12345`

Use a local or demonstration environment for this account. Do not use the demo password in production.

---

## 13. Project Status

The planned core and AI features are implemented. The application has been successfully built in the development environment.

Before production deployment, the following should still be verified:

- Database configuration in the deployment environment
- OpenRouter API key and model configuration
- Resend email configuration for password reset
- Google and GitHub OAuth credentials
- Browser notification permissions
- Manual testing of all important user flows
- Production security and environment-variable review
