# Hype Pilot

## Project Description
Hype Pilot is a task planner web application that helps users organize tasks,
track deadlines, and manage their productivity.

The application allows users to add tasks, assign priorities, view deadlines
in a calendar layout, and mark tasks as completed.

## Features
- Add tasks with due dates
- Calendar view of deadlines
- Priority labels (Top Priority / Mid Priority / Low Priority)
- Progress tracking
- Reminder alerts
- Local storage persistence

## Technology Used
- React
- JavaScript
- CSS
- LocalStorage

## Deployment
The application will be deployed using Netlify or Vercel.

## Set-up instructions
- Phase 1 → useTasks hook + localStorage
- Phase 2 → TaskForm → TaskCard → TaskList → wire up in App.js
- Phase 3 → FilterBar + priority display
- Phase 4 → CalendarView + dateHelpers
- Phase 5 → ReminderBanner
- Build and test each phase before moving to the next. This keeps the app   functional at every step and makes bugs easy to isolate.

## bugs or limitations
- Bug 1 — crypto.randomUUID() not available in Jest/jsdom Fixed by replacing it with Date.now().toString(36) +
Math.random().toString(36).slice(2
- Bug 2 — getByText matched multiple elements in App test. Fixed by using getByRole('heading', { name: /hype
pilot/i }) to scope the  query to the heading element specifically
- Bug: CalendarView heading tests failed Fix: Updated tests to query .calendar-grid instead
- Bug: App heading test failed Fix: Updated test to use getByText and check nav buttons
- Bug: TaskCard date assertion failed Fix: Updated to regex /2026-03-20/
- Bug 1: PRIORITY_CLASS in TaskCard.js (lines 1–5) is dead code — identical to CARD_BORDER but never used. Fix
1 — dead code in TaskCard.js
- Bug 2: Stale category filter — deleting the last task in a category removes it from the dropdown but filters
category still holds the old value, so  filteredTasks silently returns 0 results. Fix 2 — trim title in useTasks.
js
- Bug 3: addTask stores the untrimmed title — form validates .trim() but passes
the raw string to addTask. Fix 3 — stale category filter reset in App.js

## What I learned
I learned that testing my design myself after running AI-generated tests on the code is important in case the AI
tests miss anything. There were also times when I needed to run the AI-generated tests again to check for
errors, issues, or bugs that might not have been detected initially. It’s important to be specific and provide
well-detailed prompts for AI to generate the exact code needed for your design. Lastly, having a set design plan
and testing the design after each step can be useful for developers instead of trying to implement every feature
at once.

## Author
Taylor Burdgess