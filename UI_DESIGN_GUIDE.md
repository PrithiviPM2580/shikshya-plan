# Shikshya Plan UI Design Guide

This document is a visual and structural design spec for the project so you can generate the full UI correctly using the existing app architecture, design tokens, and product intent.

## 1. Product identity

Shikshya Plan is a study planning and productivity platform for students and learners. The product should feel:

- calm and focused
- academic but modern
- trustworthy and motivating
- clean, structured, and highly usable

The current codebase already suggests a premium educational dashboard aesthetic: soft greens, glass surfaces, spacious layouts, and a light, organized dashboard shell.

## 2. Project structure and UI meaning

The project is organized around two main product areas:

### A. Public experience
- landing page
- sign-in page
- sign-up page

This area should feel polished, welcoming, and conversion-friendly.

### B. Private dashboard experience
- dashboard
- subjects
- plans
- sessions
- tasks
- calendar
- exams
- goals
- analytics
- pomodoro
- profile
- settings

This area should feel like a serious study workspace with productivity surfaces and task-heavy interactions.

## 3. Design direction

### Core visual character
- Soft academic productivity
- Minimal but expressive
- Structured and data-driven
- Light backgrounds with subtle contrast
- Balanced open spacing with moderate density

### Design mood
- smart
- hopeful
- focused
- trustworthy
- not overly playful or cartoonish

## 4. Color system

The project already contains a strong starting palette in the global theme. Use these as the base design tokens.

### Primary palette
- Sea ink: #173A40
- Sea ink soft: #416166
- Lagoon: #4FB8B2
- Lagoon deep: #328F97
- Palm: #2F6A4A
- Sand: #E7F0E8
- Foam: #F3FAF5
- Surface: rgba(255, 255, 255, 0.74)
- Surface strong: rgba(255, 255, 255, 0.9)

### UI theme tokens already used
- Background: white / warm off-white base
- Foreground: dark slate/ink
- Primary: indigo-like accent for action states
- Secondary: purple accent for highlight states
- Border: soft gray/green neutral
- Muted foreground: soft text for helper labels

### Recommended usage
- Use deep green-teal as the primary brand color for headings, navigation highlight, active states, and high-trust actions.
- Use light sand/foam backgrounds for large content areas.
- Use white or translucent white cards for panels and widgets.
- Use indigo as a supporting accent for CTAs, focus states, or advanced analytics elements.
- Keep all text contrast high and readable.

### Suggested palette summary

Primary green family:
- #173A40
- #2F6A4A
- #4FB8B2
- #328F97

Neutral family:
- #F3FAF5
- #E7F0E8
- #F8FAFC
- #E2E8F0

Accent family:
- #6366F1
- #A855F7
- #B95F00

## 5. Typography system

The global CSS imports fonts from Google Fonts and already includes:

- Manrope for interface text
- Fraunces for headings and brand emphasis

### Recommended type strategy
- Sans-serif UI: Manrope for all normal interface text, navigation, labels, metrics, small copy
- Display serif: Fraunces for hero title, major key statements, and perhaps logo words

### Type scale
- H1: bold, large, expressive
- H2: strong and structured
- H3: dashboard card title size
- Body: clean, medium-weight UI text
- Muted label: smaller uppercase tracking for metadata

### Typography rules
- Maintain strong hierarchy across cards and modules
- Use uppercase tracking for small labels and section metadata
- Keep headlines legible and not too decorative
- Use a soft but confident weight system: 400, 500, 600, 700, 800

## 6. Layout and spacing system

### Grid structure
Use a clean max-width layout system:
- content container max width: around 1200px
- cards with rounded corners and generous padding
- dashboard uses side navigation + main content shell

### Spacing scale
Use a consistent 4px-based spacing system:
- 4, 8, 12, 16, 24, 32, 40, 48, 64

### Shape language
- Borders: lightly visible and soft
- Corners: rounded-xl to rounded-3xl
- Surface depth: small shadow, subtle glass effect, soft elevation
- Card style: white or translucent panels on pale backgrounds

## 7. Existing component patterns already important

The codebase already shows intended reusable patterns:

### Navigation patterns
- top nav on landing page
- side nav on dashboard
- section labels in uppercase with spacing
- active navigation items with highlighted background

### Cards
- white card surfaces
- rounded corners
- thin borders
- compact metadata labels
- simple stat blocks and activity panels

### Buttons
- primary action filled with brand color
- secondary or ghost actions for less prominent actions
- small pill badges for counters and tags

### Side shell layout
- left sidebar with grouped modules and account area
- header above the content panel
- central content region with cards and blocks

## 8. UI system for pages

### Landing page
This page should be a premium educational landing interface with:
- top navbar
- hero section with headline and CTA
- feature benefits row
- trust or stats section
- pricing or plan section
- final CTA block
- footer

Suggested landing hero direction:
- left side: headline, supporting copy, buttons
- right side: feature mockup / dashboard preview / planner UI card composition
- soft green gradient backdrop
- large brand-driven hero art

### Auth pages
These pages should feel calm and secure:
- centered card layout or split layout
- social sign-in buttons
- or divider
- email/password form
- spacing with friendly educational tone

Recommended styling:
- light background with card on top
- clear CTA area
- proper form field spacing
- soft shadows, no clutter

### Onboarding / academic setup flow
This is an important missing part of the product and should definitely exist.

Because the app is for students, after sign-up or first login, the user should go through a short onboarding flow to set their academic profile.

Recommended flow:
1. Welcome screen with a friendly introduction
2. Select study level: BCA / Bachelor / +2 / Other
3. Select current year or semester
   - 1st Semester, 2nd Semester, 3rd Semester...
   - or Year 1, Year 2, Year 3, Year 4 for degree programs
4. Select major or faculty if applicable
   - BCA, CSIT, BIT, Management, Science, etc.
5. Choose subjects or courses for the current semester
6. Set target goals or weekly study hours
7. Finish with a simple onboarding summary and continue to dashboard

Important UI behavior:
- Use large, clear cards for semester and year selection
- Keep the choices readable and tap-friendly
- Use a progression indicator with 3–5 steps
- Show a clean summary panel on the right or bottom with selected values
- Use soft green accent for selected semester cards

Recommended card states:
- default: soft white background, border only
- selected: green filled background or green border + accent ring
- hover: subtle lift or light highlight

This onboarding should make the app feel personalized to the student's academic journey instead of generic.

### Dashboard pages
Dashboard pages should feel like a real productivity workspace:
- left sidebar with grouped navigation
- top header with search, profile, status summary
- stat cards for metrics
- recent activity cards
- upcoming tasks / deadlines / goals panels
- charts and progress blocks for analytics pages

## 9. Content tone and messaging

Use productive, encouraging, student-focused language such as:
- plan smarter
- focus better
- track progress
- build momentum
- stay consistent
- study with clarity

Avoid heavy corporate tone. The product should feel supportive and aspirational but still clean and credible.

## 10. Recommended UI composition rules

### Keep this formula
1. One clear primary action per card/surface
2. Provide a clear visual hierarchy for headings and metrics
3. Use subtle color layering instead of heavy gradients
4. Use small badges and chips to show status without clutter
5. Leave generous whitespace around modules

### Avoid this
- too many bright colors in one screen
- excessive shadows
- dense text blocks
- random decorative elements
- dark themes dominating the interface

## 11. Current project-based design interpretation

The project already strongly hints at this design system:

- soft green and teal base
- sleek light dashboard shell
- elevated white cards
- small uppercase metadata labels
- moderate border radius and shadows
- educational productivity focus
- sidebar-first desktop product structure

This is an excellent base for a premium, learning-focused SaaS UI.

## 12. Suggested visual prompt for generating full UI

Use this as a generation prompt when creating the full interface:

> Create a modern education productivity SaaS dashboard and landing page for Shikshya Plan. Use a calm, premium academic aesthetic with soft teal-green brand colors, white card surfaces, subtle transparency, clean rounded corners, and a light polished layout. Use Manrope for interface text and Fraunces for elegant headings. Design a landing page with a clean navbar, hero area, trust stats, features, pricing section, and CTA. Design a private dashboard with a left navigation sidebar, header actions, summary metric cards, task lists, activity panels, and analytics cards. Keep the interface minimal, organized, and student-focused, with excellent spacing, readable type hierarchy, and subtle shadows. Ensure high usability, modern responsive design, and strong visual hierarchy.

## 13. Recommended implementation direction

To build the UI cleanly in this codebase:

- keep using Tailwind utility classes
- prefer shadcn-style button, card, sidebar, badge patterns
- use soft surface backgrounds and subtle border lines
- create dashboard sections as reusable cards
- keep modules consistent in spacing and metric layout
- style inactive nav items softly and active ones with highlighted primary background

## 14. Final recommendation

The strongest direction for this project is:

- premium learning dashboard
- soft green/teal + white + indigo accents
- Manrope + Fraunces typography pairing
- spacious card-first layout
- side-panel productivity UX for students
- modern, friendly, trustworthy educational SaaS style

This matches both the existing code and the app’s functional purpose very well.
