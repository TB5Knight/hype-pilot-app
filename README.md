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

## Week 12 Excercise feature
- Option B: Authentication
- I used Supabase for authentication and database management. This allowed users to securely access their own tasks instead of working in a  shared or temporary environment. Users just have to create an account with ther email and password and will recieve a comfirmation email. 

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
- Jest UUID issue: crypto.randomUUID() not available in Jest/jsdom.
Fix: Replaced with Date.now().toString(36) + Math.random().toString(36).slice(2).

- App test query conflict: getByText matched multiple elements. 
Fix: Used getByRole('heading', { name: /hype pilot/i }) to target the heading.

- CalendarView heading test failure: Fix: Updated tests to query .calendar-grid.

- App heading test failure: Fix: Updated test to use getByText and verify navigation buttons.

- TaskCard date assertion failure: Fix: Updated assertion to use regex /2026-03-20/.

- Dead code in TaskCard.js: PRIORITY_CLASS (lines 1–5) duplicates CARD_BORDER and is unused.
Fix: Removed dead code.

- Untrimmed task titles: addTask stored titles without trimming even though the form validated .trim(). 
Fix: Trim title in useTasks.js.

- Stale category filter: Deleting the last task in a category removes it from the dropdown, but the filter still
holds the old value, returning 0 results. Fix: Reset stale category filter in App.js.

## What I learned
I learned that testing my design myself after running AI-generated tests on the code is important in case the AI
tests miss anything. There were also times when I needed to run the AI-generated tests again to check for
errors, issues, or bugs that might not have been detected initially. It’s important to be specific and provide
well-detailed prompts for AI to generate the exact code needed for your design. Lastly, having a set design plan
and testing the design after each step can be useful for developers instead of trying to implement every feature
at once.

## Author
Taylor Burdgess