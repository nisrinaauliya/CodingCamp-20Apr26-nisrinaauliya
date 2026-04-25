# Implementation Plan: Life Dashboard

## Overview

Build a single-page, client-side Life Dashboard using plain HTML, CSS, and Vanilla JavaScript. The app is structured as one HTML file, one CSS file (`css/styles.css`), and one JS file (`js/app.js`). All data is persisted in `localStorage`. Implementation proceeds widget by widget, wiring everything together at the end.

## Tasks

- [x] 1. Scaffold project structure and shared storage module
  - Create `index.html` with semantic layout sections for each widget (greeting, timer, todo, quick-links) and a theme toggle control
  - Create `css/styles.css` with CSS custom properties for light/dark themes and base layout styles
  - Create `js/app.js` with the `storageGet`, `storageSet`, and `storageRemove` wrapper functions that catch `localStorage` errors and display a non-blocking banner when storage is unavailable
  - Wire the `<script>` and `<link>` tags in `index.html`
  - _Requirements: 8.1, 8.3, 9.1, 9.2, 9.4_

- [x] 2. Implement Theme Toggle
  - [x] 2.1 Implement theme functions and initialization
    - Write `applyTheme(theme)`, `toggleTheme()`, `loadTheme()`, and `saveTheme(theme)` in `app.js`
    - On page load, call `loadTheme()` and `applyTheme()` before any widget renders (sets `data-theme` on `<html>`)
    - Wire the toggle button click handler to `toggleTheme()`
    - Add light/dark CSS variable overrides in `styles.css` scoped to `[data-theme="dark"]`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 2.2 Write property test for theme persistence round-trip
    - **Property 16: Theme persistence round-trip**
    - **Validates: Requirements 7.3, 7.4**

- [x] 3. Implement Greeting Widget
  - [x] 3.1 Implement greeting helper functions
    - Write `getGreetingPrefix(hour)` covering all 24 hours (05–11 → morning, 12–17 → afternoon, 18–04 → evening)
    - Write `formatTime(date)` returning zero-padded `HH:MM`
    - Write `formatDate(date)` returning a human-readable date string
    - Write `buildGreeting(prefix, name)` returning `"[prefix], [name]!"` or `"[prefix]!"` when name is absent
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.2, 2.3_

  - [ ]* 3.2 Write property test for greeting prefix exhaustiveness
    - **Property 1: Greeting prefix is exhaustive and correct**
    - **Validates: Requirements 1.3, 1.4, 1.5**

  - [ ]* 3.3 Write property test for time format
    - **Property 2: Time format is well-formed**
    - **Validates: Requirements 1.1**

  - [ ]* 3.4 Write property test for greeting string format
    - **Property 3: Greeting string format with and without name**
    - **Validates: Requirements 2.2, 2.3**

  - [x] 3.5 Implement greeting widget rendering and name persistence
    - Write `saveUserName(name)` and `loadUserName()` using the storage module
    - Write `updateGreetingWidget()` that reads the current time, calls the helper functions, and updates the DOM
    - On page load, call `loadUserName()` and `updateGreetingWidget()`
    - Start a `setInterval` (60 s) to call `updateGreetingWidget()` each minute
    - Wire the name input field: on submit, call `saveUserName()` then `updateGreetingWidget()`; empty input clears the saved name
    - _Requirements: 1.1, 1.2, 2.1, 2.4, 2.5_

  - [ ]* 3.6 Write property test for user name persistence round-trip
    - **Property 4: User name persistence round-trip**
    - **Validates: Requirements 2.4, 2.5**

- [x] 4. Implement Focus Timer
  - [x] 4.1 Implement timer state machine and countdown logic
    - Write `formatCountdown(totalSeconds)` returning zero-padded `MM:SS`
    - Implement timer state (`idle | running | paused`) with `startTimer()`, `stopTimer()`, `resetTimer()`, and `tick()` functions
    - `tick()` decrements seconds, updates the DOM display, and calls `notifyCompletion()` when reaching 0
    - `notifyCompletion()` stops the timer and fires a browser alert or Audio API beep
    - Wire start, stop, and reset button click handlers
    - On page load, render the default 25:00 display in idle state
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 4.2 Write property test for countdown format round-trip
    - **Property 5: Countdown format round-trip**
    - **Validates: Requirements 3.1**

- [x] 5. Checkpoint — verify greeting and timer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement To-Do List
  - [x] 6.1 Implement task data functions
    - Write `isDuplicate(description, tasks)` with case-insensitive comparison
    - Write `addTask(description)` that validates non-empty/non-whitespace and non-duplicate, generates a unique id, and returns the new task or an error
    - Write `editTask(id, newDescription)`, `toggleTask(id)`, and `deleteTask(id)`
    - Write `loadTasks()` and `saveTasks(tasks)` using the storage module (fall back to `[]` on parse error)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 5.1, 5.3_

  - [ ]* 6.2 Write property test for task addition grows the list
    - **Property 6: Task addition grows the list**
    - **Validates: Requirements 4.2**

  - [ ]* 6.3 Write property test for whitespace and empty task rejection
    - **Property 7: Whitespace and empty task rejection**
    - **Validates: Requirements 4.2**

  - [ ]* 6.4 Write property test for duplicate task rejection
    - **Property 8: Duplicate task rejection preserves list**
    - **Validates: Requirements 5.1, 5.3**

  - [ ]* 6.5 Write property test for task completion toggle involution
    - **Property 9: Task completion toggle is an involution**
    - **Validates: Requirements 4.5**

  - [ ]* 6.6 Write property test for task deletion
    - **Property 10: Task deletion removes the task**
    - **Validates: Requirements 4.6**

  - [ ]* 6.7 Write property test for task persistence round-trip
    - **Property 11: Task persistence round-trip**
    - **Validates: Requirements 4.7, 4.8, 8.1**

  - [x] 6.8 Implement task list rendering and DOM wiring
    - Write `renderTaskList(tasks)` that clears and re-renders the task list in the DOM
    - Each task row includes: checkbox (toggle), description text, edit button, delete button, and strikethrough styling when completed
    - Inline edit mode: clicking edit replaces the description with an input field; saving updates the task and re-renders
    - Inline error messages for empty and duplicate submissions (adjacent to the add input)
    - On page load, call `loadTasks()` then `renderTaskList()`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.2_

- [x] 7. Implement Quick Links
  - [x] 7.1 Implement link data functions
    - Write `isValidUrl(url)` using the `URL` constructor for validation
    - Write `addLink(label, url)` that validates non-empty label and valid URL, generates a unique id, and returns the new link or a validation error
    - Write `deleteLink(id)`
    - Write `loadLinks()` and `saveLinks(links)` using the storage module (fall back to `[]` on parse error)
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 7.2 Write property test for link addition grows the list
    - **Property 12: Link addition grows the list**
    - **Validates: Requirements 6.2**

  - [ ]* 7.3 Write property test for invalid link rejection
    - **Property 13: Invalid link submission is rejected**
    - **Validates: Requirements 6.7**

  - [ ]* 7.4 Write property test for link deletion
    - **Property 14: Link deletion removes the link**
    - **Validates: Requirements 6.4**

  - [ ]* 7.5 Write property test for link persistence round-trip
    - **Property 15: Link persistence round-trip**
    - **Validates: Requirements 6.5, 6.6, 8.1**

  - [x] 7.6 Implement quick links rendering and DOM wiring
    - Write `renderLinks(links)` that clears and re-renders the links panel
    - Each link renders as a `<a>` or `<button>` that opens the URL in a new tab (`target="_blank"`, `rel="noopener noreferrer"`)
    - Each link row includes a delete button that calls `deleteLink()` and re-renders
    - Inline error messages for empty label, empty URL, or invalid URL (adjacent to the add inputs)
    - On page load, call `loadLinks()` then `renderLinks()`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 8. Checkpoint — verify to-do list and quick links
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Wire initialization and finalize layout
  - [x] 9.1 Implement the main initialization sequence in `app.js`
    - On `DOMContentLoaded`, execute in order: `loadTheme()` → `applyTheme()` → `updateGreetingWidget()` → render timer → `loadTasks()` → `renderTaskList()` → `loadLinks()` → `renderLinks()` → start clock interval
    - Ensure all widgets are fully rendered before the user can interact
    - _Requirements: 7.4, 8.2_

  - [x] 9.2 Polish layout and responsive styles in `styles.css`
    - Arrange the four widgets in a responsive grid (CSS Grid or Flexbox)
    - Ensure the dashboard is usable when opened directly from the file system (no `http://` server required — no absolute paths, no CORS-blocked resources)
    - Verify the page renders correctly in Chrome, Firefox, Edge, and Safari
    - _Requirements: 9.3, 9.4_

- [x] 10. Final checkpoint — full integration review
  - Open `index.html` directly from the file system and verify all widgets load with persisted data
  - Confirm theme toggle, greeting name, timer controls, task CRUD, and link CRUD all work end-to-end
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests reference the design's Correctness Properties section; since no test framework is pre-configured, these tasks assume fast-check will be added if/when tests are written
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after each major widget group
- The single-file JS and CSS structure (per NFR-1 / Requirement 9.2) means all code lives in `app.js` and `styles.css` — no modules or bundler needed
