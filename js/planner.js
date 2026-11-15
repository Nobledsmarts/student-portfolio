// Academic Planner: add tasks, mark them completed, delete them.
// Tasks live in an array and are saved to localStorage so they
// are still there when the page is reopened.

const STORAGE_KEY = "academicPlannerTasks";

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const courseInput = document.querySelector("#task-course");
const dueInput = document.querySelector("#task-due");
const titleError = document.querySelector("#task-title-error");
const list = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = loadTasks();      // array of { id, title, course, due, done }
let currentFilter = "all";    // "all" | "active" | "done"
let justCompleted = null;     // id of the task ticked last, so only its stamp animates

// ----- Storage -----
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    // Storage unavailable (e.g. private mode): the planner still works for this visit.
  }
}

// ----- Task operations -----
function addTask(title, course, due) {
  tasks.push({
    id: Date.now() + "-" + Math.floor(Math.random() * 100000),
    title: title,
    course: course,
    due: due,
    done: false
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    return task.id === id ? { ...task, done: !task.done } : task;
  });
  const changed = tasks.find(function (task) { return task.id === id; });
  justCompleted = changed && changed.done ? id : null;
  saveTasks();
  render();
  justCompleted = null;
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) { return task.id !== id; });
  saveTasks();
  render();
}

// ----- Helpers -----
function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

function formatDate(isoDate) {
  const parts = isoDate.split("-").map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function visibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter(function (task) { return !task.done; });
  }
  if (currentFilter === "done") {
    return tasks.filter(function (task) { return task.done; });
  }
  return tasks;
}

// ----- Rendering (DOM manipulation / dynamic content) -----
function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = "task";
  if (task.done) item.classList.add("done");

  const isOverdue = task.due && !task.done && task.due < todayString();
  if (isOverdue) item.classList.add("overdue");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.id = "task-" + task.id;
  checkbox.addEventListener("change", function () { toggleTask(task.id); });

  const titleCell = document.createElement("div");
  titleCell.className = "title-cell";

  const title = document.createElement("label");
  title.className = "title";
  title.htmlFor = checkbox.id;
  title.textContent = task.title;
  titleCell.appendChild(title);

  if (task.done) {
    const stamp = document.createElement("span");
    stamp.className = "stamp";
    stamp.textContent = "Done";
    if (task.id !== justCompleted) stamp.style.animation = "none";
    titleCell.appendChild(stamp);
  }

  const course = document.createElement("span");
  course.className = "course";
  course.textContent = task.course;

  const due = document.createElement("span");
  due.className = "due";
  if (task.due) {
    due.textContent = (isOverdue ? "Overdue " : "") + formatDate(task.due);
  } else {
    due.textContent = "No date";
  }

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "delete";
  remove.textContent = "Delete";
  remove.setAttribute("aria-label", "Delete “" + task.title + "”");
  remove.addEventListener("click", function () { deleteTask(task.id); });

  item.append(checkbox, titleCell, course, due, remove);
  return item;
}

function render() {
  const shown = visibleTasks();

  list.replaceChildren();
  shown.forEach(function (task) {
    list.appendChild(createTaskElement(task));
  });

  // Empty-state message depends on the filter in use.
  emptyMessage.hidden = shown.length > 0;
  if (tasks.length === 0) {
    emptyMessage.textContent = "Nothing on the sheet yet. Add your first task above.";
  } else if (currentFilter === "active") {
    emptyMessage.textContent = "Nothing pending. Every task is completed.";
  } else {
    emptyMessage.textContent = "No completed tasks yet.";
  }

  // Summary counters
  const completed = tasks.filter(function (task) { return task.done; }).length;
  document.querySelector("#count-total").textContent = tasks.length;
  document.querySelector("#count-active").textContent = tasks.length - completed;
  document.querySelector("#count-done").textContent = completed;
}

// ----- Events -----
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = titleInput.value.trim();

  if (title === "") {
    titleError.textContent = "Enter a task before adding it";
    titleInput.parentElement.classList.add("invalid");
    titleInput.focus();
    return;
  }

  addTask(title, courseInput.value.trim(), dueInput.value);
  form.reset();
  titleInput.focus();
});

titleInput.addEventListener("input", function () {
  titleError.textContent = "";
  titleInput.parentElement.classList.remove("invalid");
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(function (other) {
      other.setAttribute("aria-pressed", String(other === button));
    });
    render();
  });
});

render();
