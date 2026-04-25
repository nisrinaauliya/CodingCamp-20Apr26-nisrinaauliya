# Requirements Document

## Introduction

The Life Dashboard is a client-side web application built with HTML, CSS, and Vanilla JavaScript. It provides a personal productivity hub accessible from any modern browser, requiring no backend server or complex setup. The dashboard combines a live greeting, a Pomodoro-style focus timer, a to-do list, and a quick-links panel — all persisted in the browser's Local Storage. Three optional challenges are included: Light/Dark mode toggle, a custom name in the greeting, and duplicate task prevention.

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Greeting_Widget**: The UI component that displays the current time, date, and a personalized greeting message.
- **Focus_Timer**: The UI component that implements a configurable countdown timer following the Pomodoro technique.
- **Todo_List**: The UI component that manages a collection of user-defined tasks.
- **Task**: A single to-do item with a text description and a completion state.
- **Quick_Links**: The UI component that displays a set of user-defined shortcut buttons to external URLs.
- **Link**: A single quick-link entry consisting of a label and a URL.
- **Local_Storage**: The browser's `localStorage` API used for all client-side data persistence.
- **Theme**: The visual color scheme of the Dashboard, either `light` or `dark`.
- **User_Name**: An optional custom name entered by the user, displayed in the greeting.

---

## Requirements

### Requirement 1: Live Greeting

**User Story:** As a user, I want to see the current time, date, and a time-appropriate greeting when I open the dashboard, so that I have immediate context about the current moment.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format, updated every minute.
2. THE Greeting_Widget SHALL display the current date in a human-readable format (e.g., "Monday, April 25, 2026").
3. WHEN the local hour is between 05:00 and 11:59, THE Greeting_Widget SHALL display the greeting prefix "Good morning".
4. WHEN the local hour is between 12:00 and 17:59, THE Greeting_Widget SHALL display the greeting prefix "Good afternoon".
5. WHEN the local hour is between 18:00 and 04:59, THE Greeting_Widget SHALL display the greeting prefix "Good evening".

---

### Requirement 2: Custom Name in Greeting (Challenge 2)

**User Story:** As a user, I want to enter my name so that the greeting addresses me personally.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL provide an input field for the user to enter a User_Name.
2. WHEN the user submits a non-empty User_Name, THE Greeting_Widget SHALL display the greeting as "[prefix], [User_Name]!".
3. WHEN no User_Name has been saved, THE Greeting_Widget SHALL display the greeting as "[prefix]!" without a name.
4. WHEN the user saves a User_Name, THE Dashboard SHALL persist the User_Name in Local_Storage.
5. WHEN the Dashboard is loaded, THE Greeting_Widget SHALL retrieve and display the previously saved User_Name from Local_Storage.

---

### Requirement 3: Focus Timer

**User Story:** As a user, I want a countdown timer I can start, stop, and reset, so that I can manage focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL display a countdown in MM:SS format.
2. WHEN the Focus_Timer is in the idle state, THE Focus_Timer SHALL display 25:00 as the default duration.
3. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down one second per second.
4. WHEN the user activates the stop control, THE Focus_Timer SHALL pause the countdown at the current value.
5. WHEN the user activates the reset control, THE Focus_Timer SHALL return the countdown to the default duration and enter the idle state.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and notify the user with a browser alert or audio cue.

---

### Requirement 4: To-Do List

**User Story:** As a user, I want to manage a list of tasks I can add, edit, complete, and delete, so that I can track what I need to do.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an input field and a submit control for adding new Tasks.
2. WHEN the user submits a new Task with a non-empty description, THE Todo_List SHALL append the Task to the list.
3. WHEN the user activates the edit control on a Task, THE Todo_List SHALL allow the user to modify the Task's description inline.
4. WHEN the user saves an edited Task, THE Todo_List SHALL update the Task's description and persist the change to Local_Storage.
5. WHEN the user activates the complete control on a Task, THE Todo_List SHALL toggle the Task's completion state and apply a visual distinction (e.g., strikethrough).
6. WHEN the user activates the delete control on a Task, THE Todo_List SHALL remove the Task from the list and from Local_Storage.
7. WHEN the Dashboard is loaded, THE Todo_List SHALL retrieve and render all previously saved Tasks from Local_Storage.
8. WHEN any Task is added, edited, completed, or deleted, THE Todo_List SHALL persist the full updated task collection to Local_Storage.

---

### Requirement 5: Prevent Duplicate Tasks (Challenge 4)

**User Story:** As a user, I want the dashboard to prevent me from adding the same task twice, so that my list stays clean and unambiguous.

#### Acceptance Criteria

1. WHEN the user submits a new Task whose description matches an existing Task description (case-insensitive), THE Todo_List SHALL reject the submission.
2. WHEN a duplicate Task submission is rejected, THE Todo_List SHALL display an inline error message informing the user that the task already exists.
3. WHEN a duplicate Task submission is rejected, THE Todo_List SHALL NOT add the Task to the list or to Local_Storage.

---

### Requirement 6: Quick Links

**User Story:** As a user, I want to save and access my favorite website shortcuts from the dashboard, so that I can navigate quickly without typing URLs.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide input fields for a label and a URL, and a submit control for adding new Links.
2. WHEN the user submits a new Link with a non-empty label and a valid URL, THE Quick_Links SHALL display the Link as a clickable button.
3. WHEN the user activates a Link button, THE Dashboard SHALL open the associated URL in a new browser tab.
4. WHEN the user activates the delete control on a Link, THE Quick_Links SHALL remove the Link from the display and from Local_Storage.
5. WHEN the Dashboard is loaded, THE Quick_Links SHALL retrieve and render all previously saved Links from Local_Storage.
6. WHEN any Link is added or deleted, THE Quick_Links SHALL persist the full updated link collection to Local_Storage.
7. IF the user submits a Link with an empty label or an empty URL, THEN THE Quick_Links SHALL reject the submission and display an inline validation message.

---

### Requirement 7: Light / Dark Mode (Challenge 1)

**User Story:** As a user, I want to switch between a light and dark color scheme, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a toggle control to switch between the `light` Theme and the `dark` Theme.
2. WHEN the user activates the theme toggle, THE Dashboard SHALL apply the selected Theme to all visible UI components immediately.
3. WHEN the user selects a Theme, THE Dashboard SHALL persist the selected Theme value in Local_Storage.
4. WHEN the Dashboard is loaded, THE Dashboard SHALL retrieve the previously saved Theme from Local_Storage and apply it before rendering content.
5. IF no Theme has been previously saved, THEN THE Dashboard SHALL default to the `light` Theme.

---

### Requirement 8: Data Persistence Integrity

**User Story:** As a user, I want my data to survive page refreshes and browser restarts, so that I never lose my tasks, links, or preferences.

#### Acceptance Criteria

1. THE Dashboard SHALL use Local_Storage as the sole persistence mechanism for all user data.
2. WHEN the Dashboard is loaded, THE Dashboard SHALL restore all persisted data (Tasks, Links, User_Name, Theme) before the user interacts with any widget.
3. IF Local_Storage is unavailable or throws an error during a read or write operation, THEN THE Dashboard SHALL display a non-blocking warning message to the user.

---

### Requirement 9: Browser Compatibility and Structure

**User Story:** As a developer, I want the codebase to follow a clean, minimal structure, so that it is easy to maintain and runs in all modern browsers.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented using only HTML, CSS, and Vanilla JavaScript with no external frameworks or libraries.
2. THE Dashboard SHALL contain exactly one CSS file located at `css/` and exactly one JavaScript file located at `js/`.
3. THE Dashboard SHALL function correctly in the current stable versions of Chrome, Firefox, Edge, and Safari.
4. THE Dashboard SHALL be usable as a standalone web page opened directly from the file system (no server required).
