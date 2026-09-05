Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
bun install
bun --bun run dev
```

## Password Reset Email

Password recovery uses Resend. Configure these server environment variables before
enabling the reset flow in production:

```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Shikshya Plan <noreply@example.com>
```

# Building For Production

To build this application for production:

```bash
bun --bun run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bun --bun run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Uninstall the packages: `bun install @tailwindcss/vite tailwindcss -D`

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:

```bash
bun --bun run lint
bun --bun run format
bun --bun run check
```

## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpm dlx shadcn@latest add button
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "My App" },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
});
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from "@tanstack/react-start";

const getServerTime = createServerFn({
  method: "GET",
}).handler(async () => {
  return new Date().toISOString();
});

// Use in a component
function MyComponent() {
  const [time, setTime] = useState("");

  useEffect(() => {
    getServerTime().then(setTime);
  }, []);

  return <div>Server time: {time}</div>;
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/hello")({
  server: {
    handlers: {
      GET: () => json({ message: "Hello, World!" }),
    },
  },
});
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/people")({
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json();
  },
  component: PeopleComponent,
});

function PeopleComponent() {
  const data = Route.useLoaderData();
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  );
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).

# Study App

## Auth and Route Protection

- Protect `route.tsx`
- Load the current session with Better Auth
- Redirect unauthenticated users to sign-in

## Onboarding and Profile

- Create/update Profile
- Collect initial subjects and preferences
- Redirect new users through onboarding once

## Subjects CRUD

- Create subjects
- List subjects
- Edit subjects
- Delete subjects
- Subjects become the dependency for:
  - Plans
  - Sessions
  - Tasks
  - Exams
  - Analytics

## Study Plans

- Create plans
- Attach subjects to plans
- Add dates
- Add plan status

## Sessions and Tasks

- Schedule study sessions
- Add tasks
- Mark tasks as complete
- Associate tasks with subjects/plans

## Exams and Goals

- Create and manage exams
- Set academic goals
- Connect exams and goals with subjects and plans

## Dashboard, Analytics, Performance, and Revision Planner

- Build dashboard from real data
- Calculate analytics from existing data
- Track study performance
- Generate revision plans from actual subjects, sessions, tasks, plans, and exams
- Avoid maintaining separate logic or duplicate data for analytics

generator client {
provider = "prisma-client"
output = "../src/generated/prisma"
}

datasource db {
provider = "postgresql"
}

enum PlanStatus {
ACTIVE
COMPLETED
ARCHIVED
}

enum TaskPriority {
LOW
MEDIUM
HIGH
}

enum ThemeMode {
SYSTEM
LIGHT
DARK
}

model User {
id String @id
name String
email String
emailVerified Boolean @default(false)
image String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
sessions Session[]
accounts Account[]

studyLogs StudyLog[]
goals Goal[]
exams Exam[]
tasks Task[]
studySessions StudySession[]
studyPlans StudyPlan[]
subjects Subject[]
profiles Profile[]
pomodoroSessions PomodoroSession[]

@@unique([email])
@@map("user")
}

model Session {
id String @id
expiresAt DateTime
token String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
ipAddress String?
userAgent String?
userId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@unique([token])
@@index([userId])
@@map("session")
}

model Account {
id String @id
issuer String
accountId String
providerId String
userId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
accessToken String?
refreshToken String?
idToken String?
accessTokenExpiresAt DateTime?
refreshTokenExpiresAt DateTime?
scope String?
password String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@unique([issuer, accountId], map: "account_issuer_accountId_uidx")
@@index([userId])
@@map("account")
}

model Verification {
id String @id
identifier String
value String
expiresAt DateTime
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([identifier])
@@map("verification")
}

model Profile {
userId String @id
name String?
avatarUrl String?
theme ThemeMode @default(SYSTEM)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Subject {
id String @id @default(uuid()) @db.Uuid
userId String
name String
color String @default("#4F46E5")
description String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
studyPlans PlanSubject[]
studySessions StudySession[]
tasks Task[]
exams Exam[]
studyLogs StudyLog[]
pomodoroSessions PomodoroSession[]

@@index([userId])
}

model StudyPlan {
id String @id @default(uuid()) @db.Uuid
userId String
title String
description String?
goal String?
startDate DateTime? @db.Date
endDate DateTime? @db.Date
status PlanStatus @default(ACTIVE)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
subjects PlanSubject[]
sessions StudySession[]

@@index([userId])
}

model PlanSubject {
planId String @db.Uuid
subjectId String @db.Uuid
userId String

plan StudyPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
subject Subject @relation(fields: [subjectId], references: [id], onDelete: Cascade)

@@id([planId, subjectId])
@@index([userId])
}

model StudySession {
id String @id @default(uuid()) @db.Uuid
userId String
planId String? @db.Uuid
subjectId String? @db.Uuid
title String
scheduledDate DateTime @default(now())
durationMin Int @default(30)
completed Boolean @default(false)
notes String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
plan StudyPlan? @relation(fields: [planId], references: [id], onDelete: SetNull)
subject Subject? @relation(fields: [subjectId], references: [id], onDelete: SetNull)
tasks Task[]
logs StudyLog[]

@@index([userId, scheduledDate])
}

model Task {
id String @id @default(uuid()) @db.Uuid
userId String
sessionId String? @db.Uuid
subjectId String? @db.Uuid
title String
description String?
priority TaskPriority @default(MEDIUM)
dueDate DateTime?
completed Boolean @default(false)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
session StudySession? @relation(fields: [sessionId], references: [id], onDelete: SetNull)
subject Subject? @relation(fields: [subjectId], references: [id], onDelete: SetNull)

@@index([userId, dueDate])
}

model Exam {
id String @id @default(uuid()) @db.Uuid
userId String
subjectId String? @db.Uuid
title String
examDate DateTime
syllabus String?
completed Boolean @default(false)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
subject Subject? @relation(fields: [subjectId], references: [id], onDelete: SetNull)

@@index([userId, examDate])
}

model Goal {
id String @id @default(uuid()) @db.Uuid
userId String
title String
target Int @default(100)
progress Int @default(0)
deadline DateTime? @db.Date
completed Boolean @default(false)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model StudyLog {
id String @id @default(uuid()) @db.Uuid
userId String
sessionId String? @db.Uuid
subjectId String? @db.Uuid
minutes Int
loggedAt DateTime @default(now())

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
session StudySession? @relation(fields: [sessionId], references: [id], onDelete: SetNull)
subject Subject? @relation(fields: [subjectId], references: [id], onDelete: SetNull)

@@index([userId, loggedAt])
}

model PomodoroSession {
id String @id @default(uuid()) @db.Uuid
userId String
subjectId String? @db.Uuid
title String?
focusMinutes Int @default(25)
completed Boolean @default(false)
startedAt DateTime @default(now())
endedAt DateTime?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

user User @relation(fields: [userId], references: [id], onDelete: Cascade)
subject Subject? @relation(fields: [subjectId], references: [id], onDelete: SetNull)
}
