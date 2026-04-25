/* ============================================================
   Life Dashboard — app.js
   Single-file Vanilla JS application.
   No external frameworks or libraries.
   ============================================================ */

'use strict';

/* ============================================================
   Storage Module
   Thin wrapper around localStorage that catches errors and
   displays a non-blocking banner when storage is unavailable.
   ============================================================ */

/** @type {boolean} Tracks whether the storage banner has been shown. */
let _storageBannerShown = false;

/**
 * Show the non-blocking storage unavailable banner once.
 * @returns {void}
 */
function _showStorageBanner() {
  if (_storageBannerShown) return;
  _storageBannerShown = true;
  const banner = document.getElementById('storage-banner');
  if (banner) {
    banner.classList.remove('hidden');
  }
}

/**
 * Retrieve a value from localStorage by key.
 * Returns null if the key does not exist or if storage is unavailable.
 *
 * @param {string} key - The localStorage key to read.
 * @returns {string|null} The stored string value, or null.
 */
function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.error('[LifeDashboard] storageGet failed for key "' + key + '":', err);
    _showStorageBanner();
    return null;
  }
}

/**
 * Write a value to localStorage.
 * Silently catches errors and shows the storage banner if unavailable.
 *
 * @param {string} key   - The localStorage key to write.
 * @param {string} value - The string value to store.
 * @returns {void}
 */
function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error('[LifeDashboard] storageSet failed for key "' + key + '":', err);
    _showStorageBanner();
  }
}

/**
 * Remove a key from localStorage.
 * Silently catches errors and shows the storage banner if unavailable.
 *
 * @param {string} key - The localStorage key to remove.
 * @returns {void}
 */
function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('[LifeDashboard] storageRemove failed for key "' + key + '":', err);
    _showStorageBanner();
  }
}

/* ============================================================
   localStorage Keys
   ============================================================ */
const KEYS = {
  TASKS:    'ld_tasks',
  LINKS:    'ld_links',
  USERNAME: 'ld_username',
  THEME:    'ld_theme',
};

/* ============================================================
   Theme Module
   Manages light/dark theme via data-theme on <html>.
   ============================================================ */

/**
 * Load the saved theme from localStorage.
 * Defaults to "light" if nothing is stored.
 *
 * @returns {"light"|"dark"} The stored theme, or "light".
 */
function loadTheme() {
  var stored = storageGet(KEYS.THEME);
  return stored === 'dark' ? 'dark' : 'light';
}

/**
 * Persist the given theme to localStorage.
 *
 * @param {"light"|"dark"} theme - The theme value to save.
 * @returns {void}
 */
function saveTheme(theme) {
  storageSet(KEYS.THEME, theme);
}

/**
 * Apply a theme by setting data-theme on <html> and updating
 * the toggle button label/icon.
 *
 * @param {"light"|"dark"} theme - The theme to apply.
 * @returns {void}
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  var iconEl  = btn.querySelector('.theme-toggle__icon');
  var labelEl = btn.querySelector('.theme-toggle__label');

  if (theme === 'dark') {
    if (iconEl)  iconEl.textContent  = '☀️';
    if (labelEl) labelEl.textContent = 'Light mode';
    btn.setAttribute('aria-label', 'Switch to light theme');
  } else {
    if (iconEl)  iconEl.textContent  = '🌙';
    if (labelEl) labelEl.textContent = 'Dark mode';
    btn.setAttribute('aria-label', 'Switch to dark theme');
  }
}

/**
 * Toggle between light and dark themes.
 * Reads the current theme from <html>, flips it, then saves and applies.
 *
 * @returns {void}
 */
function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || 'light';
  var next = current === 'dark' ? 'light' : 'dark';
  saveTheme(next);
  applyTheme(next);
}

/* ============================================================
   Greeting Widget
   Pure helper functions for time display and greeting logic.
   ============================================================ */

/**
 * Return the appropriate greeting prefix for the given hour.
 * - 05–11 → "Good morning"
 * - 12–17 → "Good afternoon"
 * - 18–23 and 0–4 → "Good evening"
 *
 * @param {number} hour - Integer hour in the range 0–23.
 * @returns {string} The greeting prefix.
 */
function getGreetingPrefix(hour) {
  if (hour >= 5 && hour <= 11) {
    return 'Good morning';
  } else if (hour >= 12 && hour <= 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Format a Date object as a zero-padded HH:MM string.
 *
 * @param {Date} date - The date/time to format.
 * @returns {string} Time string in "HH:MM" format.
 */
function formatTime(date) {
  var hours   = String(date.getHours()).padStart(2, '0');
  var minutes = String(date.getMinutes()).padStart(2, '0');
  return hours + ':' + minutes;
}

/**
 * Format a Date object as a human-readable date string.
 * Example: "Monday, April 25, 2026"
 *
 * @param {Date} date - The date to format.
 * @returns {string} Human-readable date string.
 */
function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

/**
 * Build the full greeting string from a prefix and an optional name.
 * - With name: "[prefix], [name]!"
 * - Without name: "[prefix]!"
 *
 * @param {string}      prefix - The greeting prefix (e.g. "Good morning").
 * @param {string|null} name   - The user's name, or null/empty string.
 * @returns {string} The complete greeting string.
 */
function buildGreeting(prefix, name) {
  if (name && name.length > 0) {
    return prefix + ', ' + name + '!';
  }
  return prefix + '!';
}

/**
 * Persist the user's name to localStorage.
 * If the trimmed name is non-empty, stores it; otherwise removes the key.
 *
 * @param {string} name - The name to save (may be empty to clear).
 * @returns {void}
 */
function saveUserName(name) {
  var trimmedName = name.trim();
  if (trimmedName.length > 0) {
    storageSet(KEYS.USERNAME, trimmedName);
  } else {
    storageRemove(KEYS.USERNAME);
  }
}

/**
 * Load the saved user name from localStorage.
 *
 * @returns {string|null} The stored name, or null if none is saved.
 */
function loadUserName() {
  return storageGet(KEYS.USERNAME);
}

/**
 * Update all DOM elements in the Greeting Widget with the current
 * time, date, and personalized greeting message.
 *
 * @returns {void}
 */
function updateGreetingWidget() {
  var now    = new Date();
  var prefix = getGreetingPrefix(now.getHours());
  var name   = loadUserName();

  var timeEl = document.getElementById('greeting-time');
  if (timeEl) timeEl.textContent = formatTime(now);

  var dateEl = document.getElementById('greeting-date');
  if (dateEl) dateEl.textContent = formatDate(now);

  var msgEl = document.getElementById('greeting-message');
  if (msgEl) msgEl.textContent = buildGreeting(prefix, name);

  var nameInput = document.getElementById('greeting-name-input');
  if (nameInput) nameInput.value = name || '';
}

/* ============================================================
   Focus Timer
   Pomodoro-style countdown timer with idle/running/paused states.
   ============================================================ */

/**
 * Format a total number of seconds as a zero-padded MM:SS string.
 * Accepts integers in the range 0–1499.
 *
 * @param {number} totalSeconds - Integer seconds in the range 0–1499.
 * @returns {string} Formatted string in "MM:SS" format.
 *
 * @example
 * formatCountdown(90)   // "01:30"
 * formatCountdown(0)    // "00:00"
 * formatCountdown(1499) // "24:59"
 */
function formatCountdown(totalSeconds) {
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

/** @type {"idle"|"running"|"paused"} Current timer state. */
var _timerState = 'idle';

/** @type {number} Remaining seconds on the countdown. */
var _timerSeconds = 1500;

/** @type {number|null} Reference to the active setInterval handle. */
var _timerInterval = null;

/**
 * Update the disabled state of the three timer buttons based on
 * the current value of `_timerState`.
 *
 * @returns {void}
 */
function _updateTimerButtons() {
  var startBtn = document.getElementById('timer-start');
  var stopBtn  = document.getElementById('timer-stop');
  var resetBtn = document.getElementById('timer-reset');

  if (!startBtn || !stopBtn || !resetBtn) return;

  if (_timerState === 'running') {
    startBtn.disabled = true;
    stopBtn.disabled  = false;
    resetBtn.disabled = false;
  } else {
    // idle or paused
    startBtn.disabled = false;
    stopBtn.disabled  = true;
    resetBtn.disabled = false;
  }
}

/**
 * Notify the user that the focus session has completed.
 * Stops the timer, then fires a browser alert or an Audio API beep
 * if the Web Audio API is available.
 *
 * @returns {void}
 */
function notifyCompletion() {
  stopTimer();

  // Attempt an Audio API beep; fall back to window.alert.
  try {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      var ctx        = new AudioCtx();
      var oscillator = ctx.createOscillator();
      var gainNode   = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type      = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1.0);

      oscillator.onended = function () {
        ctx.close();
      };
    } else {
      window.alert('Focus session complete! Great work!');
    }
  } catch (err) {
    window.alert('Focus session complete! Great work!');
  }
}

/**
 * Called every second while the timer is running.
 * Decrements `_timerSeconds`, updates the display, and triggers
 * `notifyCompletion()` when the countdown reaches zero.
 *
 * @returns {void}
 */
function tick() {
  _timerSeconds -= 1;

  var display = document.getElementById('timer-display');
  if (display) {
    display.textContent = formatCountdown(_timerSeconds);
  }

  if (_timerSeconds <= 0) {
    notifyCompletion();
  }
}

/**
 * Start the timer from idle or paused state.
 * Transitions `_timerState` to "running" and begins the 1-second interval.
 *
 * @returns {void}
 */
function startTimer() {
  if (_timerState === 'running') return;

  _timerState    = 'running';
  _timerInterval = setInterval(tick, 1000);
  _updateTimerButtons();
}

/**
 * Stop (pause) the timer from running state.
 * Clears the interval and transitions `_timerState` to "paused".
 *
 * @returns {void}
 */
function stopTimer() {
  if (_timerInterval !== null) {
    clearInterval(_timerInterval);
    _timerInterval = null;
  }
  _timerState = 'paused';
  _updateTimerButtons();
}

/**
 * Reset the timer to its default idle state (25:00).
 * Clears any active interval, resets state and seconds, and updates the DOM.
 *
 * @returns {void}
 */
function resetTimer() {
  if (_timerInterval !== null) {
    clearInterval(_timerInterval);
    _timerInterval = null;
  }

  _timerState   = 'idle';
  _timerSeconds = 1500;

  var display = document.getElementById('timer-display');
  if (display) {
    display.textContent = '25:00';
  }

  _updateTimerButtons();
}

/* ============================================================
   To-Do List
   Pure data functions for task management with localStorage
   persistence. Task shape: { id, description, completed }
   ============================================================ */

/** @type {Array<{id: string, description: string, completed: boolean}>} In-memory task list. */
var _tasks = [];

/**
 * Check whether a description already exists in the given task list
 * (case-insensitive, trimmed comparison).
 *
 * @param {string} description - The description to check.
 * @param {Array<{id: string, description: string, completed: boolean}>} tasks - The task list to search.
 * @returns {boolean} True if a matching task exists, false otherwise.
 */
function isDuplicate(description, tasks) {
  var normalized = description.trim().toLowerCase();
  return tasks.some(function (task) {
    return task.description.trim().toLowerCase() === normalized;
  });
}

/**
 * Add a new task to the in-memory list and persist it.
 * Validates that the description is non-empty and non-duplicate.
 *
 * @param {string} description - The task description to add.
 * @returns {{ok: true, task: {id: string, description: string, completed: boolean}}
 *          |{ok: false, error: 'empty'|'duplicate'}} Result object.
 */
function addTask(description) {
  var trimmedDesc = description.trim();

  if (trimmedDesc.length === 0) {
    return { ok: false, error: 'empty' };
  }

  if (isDuplicate(trimmedDesc, _tasks)) {
    return { ok: false, error: 'duplicate' };
  }

  var newTask = {
    id:          String(Date.now()),
    description: trimmedDesc,
    completed:   false,
  };

  _tasks.push(newTask);
  saveTasks(_tasks);

  return { ok: true, task: newTask };
}

/**
 * Update the description of an existing task by id.
 * Trims the new description before saving.
 *
 * @param {string} id             - The id of the task to edit.
 * @param {string} newDescription - The replacement description.
 * @returns {void}
 */
function editTask(id, newDescription) {
  var task = _tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.description = newDescription.trim();
    saveTasks(_tasks);
  }
}

/**
 * Toggle the completed state of a task by id.
 *
 * @param {string} id - The id of the task to toggle.
 * @returns {void}
 */
function toggleTask(id) {
  var task = _tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.completed = !task.completed;
    saveTasks(_tasks);
  }
}

/**
 * Remove a task from the in-memory list by id and persist the change.
 *
 * @param {string} id - The id of the task to delete.
 * @returns {void}
 */
function deleteTask(id) {
  _tasks = _tasks.filter(function (t) { return t.id !== id; });
  saveTasks(_tasks);
}

/**
 * Load tasks from localStorage into the in-memory list.
 * Falls back to an empty array on parse error or missing key.
 *
 * @returns {Array<{id: string, description: string, completed: boolean}>} The loaded task array.
 */
function loadTasks() {
  var raw = storageGet(KEYS.TASKS);
  if (raw === null) {
    _tasks = [];
    return _tasks;
  }
  try {
    _tasks = JSON.parse(raw);
  } catch (err) {
    _tasks = [];
  }
  return _tasks;
}

/**
 * Persist the given task array to localStorage as a JSON string.
 *
 * @param {Array<{id: string, description: string, completed: boolean}>} tasks - The task array to save.
 * @returns {void}
 */
function saveTasks(tasks) {
  storageSet(KEYS.TASKS, JSON.stringify(tasks));
}

/**
 * Clear and re-render the task list in the DOM.
 * Each task row contains a checkbox, description text, an edit button,
 * and a delete button. Completed tasks receive a visual distinction.
 * Clicking the edit button enters inline edit mode.
 *
 * @param {Array<{id: string, description: string, completed: boolean}>} tasks - The task array to render.
 * @returns {void}
 */
function renderTaskList(tasks) {
  var list = document.getElementById('todo-list');
  if (!list) return;

  list.innerHTML = '';

  tasks.forEach(function (task) {
    // --- <li> ---
    var li = document.createElement('li');
    li.className = 'todo__item' + (task.completed ? ' todo__item--completed' : '');

    // --- Checkbox ---
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo__item-checkbox';
    checkbox.setAttribute('aria-label', 'Toggle task');
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function () {
      toggleTask(task.id);
      renderTaskList(_tasks);
    });

    // --- Description span ---
    var span = document.createElement('span');
    span.className = 'todo__item-text';
    span.textContent = task.description;

    // --- Actions container ---
    var actions = document.createElement('div');
    actions.className = 'todo__item-actions';

    // Edit button
    var editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn btn--icon';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.textContent = '✏️';

    // Delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn--danger';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '🗑';
    deleteBtn.addEventListener('click', function () {
      deleteTask(task.id);
      renderTaskList(_tasks);
    });

    // Edit button click — enter inline edit mode
    editBtn.addEventListener('click', function () {
      // Replace span with a text input
      var editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.className = 'todo__item-edit-input';
      editInput.value = task.description;
      li.replaceChild(editInput, span);

      // Replace edit button with a save button
      var saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'btn btn--primary';
      saveBtn.textContent = 'Save';
      actions.replaceChild(saveBtn, editBtn);

      editInput.focus();

      function commitEdit() {
        var newValue = editInput.value;
        editTask(task.id, newValue);
        renderTaskList(_tasks);
      }

      saveBtn.addEventListener('click', commitEdit);

      editInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          commitEdit();
        } else if (e.key === 'Escape') {
          renderTaskList(_tasks);
        }
      });
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actions);

    list.appendChild(li);
  });
}

/* ============================================================
   Quick Links
   Pure data functions for link management with localStorage
   persistence. Link shape: { id, label, url }
   ============================================================ */

/** @type {Array<{id: string, label: string, url: string}>} In-memory link list. */
var _links = [];

/**
 * Validate a URL string using the URL constructor.
 * Returns false for empty strings or strings that fail URL parsing.
 *
 * @param {string} url - The URL string to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
function isValidUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Add a new link to the in-memory list and persist it.
 * Validates that the label is non-empty and the URL is non-empty and valid.
 *
 * @param {string} label - The display label for the link.
 * @param {string} url   - The URL the link points to.
 * @returns {{ok: true, link: {id: string, label: string, url: string}}
 *          |{ok: false, error: 'label'|'url_empty'|'url_invalid'}} Result object.
 */
function addLink(label, url) {
  var trimmedLabel = label.trim();
  var trimmedUrl   = url.trim();

  if (trimmedLabel.length === 0) {
    return { ok: false, error: 'label' };
  }

  if (trimmedUrl.length === 0) {
    return { ok: false, error: 'url_empty' };
  }

  if (!isValidUrl(trimmedUrl)) {
    return { ok: false, error: 'url_invalid' };
  }

  var newLink = {
    id:    String(Date.now()),
    label: trimmedLabel,
    url:   trimmedUrl,
  };

  _links.push(newLink);
  saveLinks(_links);

  return { ok: true, link: newLink };
}

/**
 * Remove a link from the in-memory list by id and persist the change.
 *
 * @param {string} id - The id of the link to delete.
 * @returns {void}
 */
function deleteLink(id) {
  _links = _links.filter(function (link) { return link.id !== id; });
  saveLinks(_links);
}

/**
 * Load links from localStorage into the in-memory list.
 * Falls back to an empty array on parse error or missing key.
 *
 * @returns {Array<{id: string, label: string, url: string}>} The loaded link array.
 */
function loadLinks() {
  var raw = storageGet(KEYS.LINKS);
  if (raw === null) {
    _links = [];
    return _links;
  }
  try {
    _links = JSON.parse(raw);
  } catch (err) {
    _links = [];
  }
  return _links;
}

/**
 * Persist the given link array to localStorage as a JSON string.
 *
 * @param {Array<{id: string, label: string, url: string}>} links - The link array to save.
 * @returns {void}
 */
function saveLinks(links) {
  storageSet(KEYS.LINKS, JSON.stringify(links));
}

/**
 * Clear and re-render the quick links panel in the DOM.
 * Each link renders as a clickable anchor opening in a new tab,
 * accompanied by a delete button.
 *
 * @param {Array<{id: string, label: string, url: string}>} links - The link array to render.
 * @returns {void}
 */
function renderLinks(links) {
  var container = document.getElementById('links-list');
  if (!container) return;

  container.innerHTML = '';

  links.forEach(function (link) {
    // --- Wrapper <div> ---
    var div = document.createElement('div');
    div.className = 'links__item';

    // --- Anchor ---
    var anchor = document.createElement('a');
    anchor.className = 'links__item-anchor';
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = link.label;

    // --- Delete button ---
    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn btn--danger';
    deleteBtn.setAttribute('aria-label', 'Delete link');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', function () {
      deleteLink(link.id);
      renderLinks(_links);
    });

    div.appendChild(anchor);
    div.appendChild(deleteBtn);
    container.appendChild(div);
  });
}

/* ============================================================
   Application Entry Point
   Wired on DOMContentLoaded — widgets will be implemented in
   subsequent tasks and called from here.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Apply saved theme before any widget renders
  applyTheme(loadTheme());

  // Wire theme toggle button
  var themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // 2. Render greeting widget and start the clock interval
  updateGreetingWidget();
  setInterval(updateGreetingWidget, 60000);

  // Wire greeting name form submit handler
  var greetingNameForm = document.getElementById('greeting-name-form');
  if (greetingNameForm) {
    greetingNameForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var nameInput = document.getElementById('greeting-name-input');
      var trimmedValue = nameInput ? nameInput.value.trim() : '';
      saveUserName(trimmedValue);
      updateGreetingWidget();
    });
  }

  // 3. Initialize Focus Timer display and wire button handlers
  var timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = '25:00';
  }
  _updateTimerButtons();

  var timerStartBtn = document.getElementById('timer-start');
  if (timerStartBtn) {
    timerStartBtn.addEventListener('click', startTimer);
  }

  var timerStopBtn = document.getElementById('timer-stop');
  if (timerStopBtn) {
    timerStopBtn.addEventListener('click', stopTimer);
  }

  var timerResetBtn = document.getElementById('timer-reset');
  if (timerResetBtn) {
    timerResetBtn.addEventListener('click', resetTimer);
  }

  // 4. Load and render tasks
  loadTasks();
  renderTaskList(_tasks);

  // Wire the add-task form submit handler
  var todoAddForm = document.getElementById('todo-add-form');
  var todoError   = document.getElementById('todo-error');
  if (todoAddForm) {
    todoAddForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var todoInput = document.getElementById('todo-input');
      var value = todoInput ? todoInput.value : '';
      var result = addTask(value);

      if (result.ok) {
        if (todoInput) todoInput.value = '';
        if (todoError) todoError.hidden = true;
        renderTaskList(_tasks);
      } else {
        if (todoError) {
          todoError.hidden = false;
          todoError.textContent = result.error === 'empty'
            ? 'Task cannot be empty'
            : 'Task already exists';
        }
      }
    });
  }

  // 5. Load and render quick links
  loadLinks();
  renderLinks(_links);

  // Wire the add-link form submit handler
  var linksAddForm  = document.getElementById('links-add-form');
  var linksError    = document.getElementById('links-error');
  if (linksAddForm) {
    linksAddForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var labelInput = document.getElementById('links-label-input');
      var urlInput   = document.getElementById('links-url-input');
      var label = labelInput ? labelInput.value : '';
      var url   = urlInput   ? urlInput.value   : '';
      var result = addLink(label, url);

      if (result.ok) {
        if (labelInput) labelInput.value = '';
        if (urlInput)   urlInput.value   = '';
        if (linksError) linksError.hidden = true;
        renderLinks(_links);
      } else {
        if (linksError) {
          linksError.hidden = false;
          if (result.error === 'label') {
            linksError.textContent = 'Label is required';
          } else {
            // url_empty or url_invalid
            linksError.textContent = 'Please enter a valid URL';
          }
        }
      }
    });
  }
});
