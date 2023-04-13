# TaskTimer

I want

## First Iteration (after 2 attempts)

Actually this is the third iteration as ChatGPT first gave me an incomplete JavaScript Code and then after asking for the rest gave me complete other code that did not match the HTML.

### Prompt

> I need to be able to track time for individual tasks. Each Task has a name and summed time. Write me an application where I can add a task with name and track time with a stopwatch like function. This application should run in a browser. It does not need to persist the data.

### Result

index.html

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8">
  <title>Task Timer</title>
  <style>
   body {
    font-family: Arial, sans-serif;
   }

   label {
    display: block;
    margin-bottom: 10px;
   }

   input[type="text"] {
    padding: 5px;
    margin-bottom: 10px;
   }

   button {
    padding: 5px 10px;
    margin-right: 10px;
   }

   #timer {
    font-size: 2em;
    margin-bottom: 10px;
   }

   #task-list div {
    margin-bottom: 5px;
   }
  </style>
 </head>
 <body>
  <h1>Task Timer</h1>
  <label for="task-name">Task name:</label>
  <input type="text" id="task-name">
  <button id="start-btn">Start</button>
  <button id="stop-btn">Stop</button>
  <button id="reset-btn">Reset</button>
  <div id="timer">00:00:00</div>
  <div id="task-list"></div>
  <script src="task-timer.js"></script>
 </body>
</html>
```

task-timer.js

```JavaScript
// Get the DOM elements
const taskNameInput = document.getElementById('task-name');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const timerDiv = document.getElementById('timer');
const taskList = [];

// Set the initial values
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;

// Add event listeners to the buttons
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

function startTimer() {
 // Get the current time
 startTime = Date.now();

 // Start the timer interval
 timerInterval = setInterval(() => {
  // Calculate the elapsed time
  elapsedTime = Date.now() - startTime;

  // Format the time
  let hours = Math.floor(elapsedTime / (60 * 60 * 1000)).toString().padStart(2, '0');
  let minutes = Math.floor((elapsedTime / (60 * 1000)) % 60).toString().padStart(2, '0');
  let seconds = Math.floor((elapsedTime / 1000) % 60).toString().padStart(2, '0');

  // Update the timer display
  timerDiv.textContent = `${hours}:${minutes}:${seconds}`;
 }, 1000);
}

function stopTimer() {
 // Stop the timer interval
 clearInterval(timerInterval);

 // Add the elapsed time to the task list
 addTaskToList(taskNameInput.value, elapsedTime);

 // Reset the timer
 resetTimer();
}

function resetTimer() {
 // Reset the timer variables
 startTime = 0;
 elapsedTime = 0;
 timerInterval = null;

 // Update the timer display
 timerDiv.textContent = '00:00:00';

 // Clear the task name input
 taskNameInput.value = '';
}

function addTaskToList(name, time) {
 // Create a new task object
 const task = { name, time };

 // Add the task to the task list
 taskList.push(task);

 // Update the task list display
 updateTaskList();
}

function updateTaskList() {
 // Get the task list element
 const taskListElement = document.getElementById('task-list');

 // Clear the task list element
 taskListElement.innerHTML = '';

 // Add each task to the task list element
 taskList.forEach(task => {
  const taskElement = document.createElement('div');
  taskElement.textContent = `${task.name}: ${formatTime(task.time)}`;
  taskListElement.appendChild(taskElement);
 });
}

function formatTime(time) {
 // Format the time as HH:MM:SS
 let hours = Math.floor(time / (60 * 60 * 1000)).toString().padStart(2, '0');
 let minutes = Math.floor((time / (60 * 1000)) % 60).toString().padStart(2, '0');
 let seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
 return `${hours}:${minutes}:${seconds}`;
}
```

### Analysis

I was not really happy with this solution. As it only provides one timer for all tasks which is not really what I wanted. Rereading my prompt I see my mistake: I should have specifically stated, that each added task should have it's own timer.

## Second Iteration

### Prompt

> The task should be added first and then I should be able to start/stop the timer for each task individually in the list.

### Result

index.html

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8">
  <title>Task Timer</title>
  <style>
   body {
    font-family: Arial, sans-serif;
   }

   label {
    display: block;
    margin-bottom: 10px;
   }

   input[type="text"] {
    padding: 5px;
    margin-bottom: 10px;
   }

   button {
    padding: 5px 10px;
    margin-right: 10px;
   }

   #task-list div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
    padding: 5px;
    border: 1px solid #ccc;
   }

   .task-name {
    flex: 1;
    margin-right: 10px;
   }

   .task-timer {
    font-size: 1.2em;
   }

   .task-actions button {
    margin-left: 10px;
   }

   .active-task {
    background-color: #c2e0ff;
   }
  </style>
 </head>
 <body>
  <h1>Task Timer</h1>
  <label for="task-name">Task name:</label>
  <input type="text" id="task-name">
  <button id="add-task-btn">Add Task</button>
  <div id="task-list"></div>
  <script src="task-timer.js"></script>
 </body>
</html>

```

task-timer.js

```javascript
// Get HTML elements
const taskNameInput = document.getElementById("task-name");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

let activeTaskId = null;

// Function to create a new task element
function createTaskElement(taskName) {
  // Create elements
  const taskContainer = document.createElement("div");
  const taskNameSpan = document.createElement("span");
  const taskTimerSpan = document.createElement("span");
  const taskActionsSpan = document.createElement("span");
  const startBtn = document.createElement("button");
  const stopBtn = document.createElement("button");
  const resetBtn = document.createElement("button");

  // Set element attributes
  taskContainer.classList.add("task");
  taskNameSpan.classList.add("task-name");
  taskNameSpan.textContent = taskName;
  taskTimerSpan.classList.add("task-timer");
  taskActionsSpan.classList.add("task-actions");
  startBtn.textContent = "Start";
  startBtn.addEventListener("click", startTimer);
  stopBtn.textContent = "Stop";
  stopBtn.addEventListener("click", stopTimer);
  resetBtn.textContent = "Reset";
  resetBtn.addEventListener("click", resetTimer);

  // Append elements to task container
  taskContainer.appendChild(taskNameSpan);
  taskContainer.appendChild(taskTimerSpan);
  taskActionsSpan.appendChild(startBtn);
  taskActionsSpan.appendChild(stopBtn);
  taskActionsSpan.appendChild(resetBtn);
  taskContainer.appendChild(taskActionsSpan);

  return taskContainer;
}

// Function to add a new task to the list
function addTask() {
  const taskName = taskNameInput.value;
  if (taskName === "") return;

  // Create new task element
  const taskElement = createTaskElement(taskName);

  // Add task element to task list
  taskList.appendChild(taskElement);

  // Clear task name input
  taskNameInput.value = "";
}

// Function to start the timer for a task
function startTimer(event) {
  const taskElement = event.target.closest(".task");
  if (taskElement === null) return;
  if (activeTaskId !== null) {
    stopTimer();
  }
  activeTaskId = setInterval(() => {
    const taskTimerElement = taskElement.querySelector(".task-timer");
    const [hours, minutes, seconds] = taskTimerElement.textContent.split(":").map(parseFloat);
    const newSeconds = seconds + 1;
    const newMinutes = minutes + Math.floor(newSeconds / 60);
    const newHours = hours + Math.floor(newMinutes / 60);
    taskTimerElement.textContent = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:${(newSeconds % 60).toString().padStart(2, "0")}`;
  }, 1000);
  taskElement.classList.add("active-task");
}

// Function to stop the timer for a task
function stopTimer() {
  const activeTaskElement = document.querySelector(".active-task");
  if (activeTaskElement === null) return;
  clearInterval(activeTaskId);
  activeTaskId = null;
  activeTaskElement.classList.remove("active-task");
}

// Function to reset the timer for a task
function resetTimer(event) {
  const taskElement = event.target.closest(".task");
  if (taskElement === null) return;
  const taskTimerElement = taskElement.querySelector(".task-timer");
  taskTimerElement.textContent = "00:00:00";
}

// Event listeners
addTaskBtn.addEventListener("click", addTask);
```

### Analysis

## Third Iteration

### Prompt

> With this code the taskTimerElement is initially not set which leads to the timer not properly counting up. Furthermore only one task can have a running timer due to usage of activeTaskId. Instead each task should be able to run individually.

### Result

task-timer.js

```javascript
// Get HTML elements
const taskNameInput = document.getElementById("task-name");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Function to create a new task element
function createTaskElement(taskName) {
  // Create elements
  const taskContainer = document.createElement("div");
  const taskNameSpan = document.createElement("span");
  const taskTimerSpan = document.createElement("span");
  const taskActionsSpan = document.createElement("span");
  const startBtn = document.createElement("button");
  const stopBtn = document.createElement("button");
  const resetBtn = document.createElement("button");

  // Set element attributes
  taskContainer.classList.add("task");
  taskNameSpan.classList.add("task-name");
  taskNameSpan.textContent = taskName;
  taskTimerSpan.classList.add("task-timer");
  taskTimerSpan.textContent = "00:00:00";
  taskActionsSpan.classList.add("task-actions");
  startBtn.textContent = "Start";
  startBtn.addEventListener("click", startTimer);
  stopBtn.textContent = "Stop";
  stopBtn.addEventListener("click", stopTimer);
  resetBtn.textContent = "Reset";
  resetBtn.addEventListener("click", resetTimer);

  // Append elements to task container
  taskContainer.appendChild(taskNameSpan);
  taskContainer.appendChild(taskTimerSpan);
  taskActionsSpan.appendChild(startBtn);
  taskActionsSpan.appendChild(stopBtn);
  taskActionsSpan.appendChild(resetBtn);
  taskContainer.appendChild(taskActionsSpan);

  return taskContainer;
}

// Function to add a new task to the list
function addTask() {
  const taskName = taskNameInput.value;
  if (taskName === "") return;

  // Create new task element
  const taskElement = createTaskElement(taskName);

  // Add task element to task list
  taskList.appendChild(taskElement);

  // Clear task name input
  taskNameInput.value = "";
}

// Function to start the timer for a task
function startTimer(event) {
  const taskElement = event.target.closest(".task");
  if (taskElement === null) return;

  const taskTimerElement = taskElement.querySelector(".task-timer");

  // Stop any active timers on other tasks
  const activeTaskElement = document.querySelector(".active-task");
  if (activeTaskElement !== null && activeTaskElement !== taskElement) {
    stopTimer(activeTaskElement);
  }

  const startTime = Date.now() - getTimeInSeconds(taskTimerElement.textContent) * 1000;

  taskElement.intervalId = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    taskTimerElement.textContent = getTimeStringFromSeconds(elapsedSeconds);
  }, 1000);

  taskElement.classList.add("active-task");
}

// Function to stop the timer for a task
function stopTimer(taskElement) {
  if (taskElement === null) return;

  const taskTimerElement = taskElement.querySelector(".task-timer");

  clearInterval(taskElement.intervalId);
  taskElement.intervalId = null;
  taskElement.classList.remove("active-task");
}

// Function to reset the timer for a task
function resetTimer(event) {
  const taskElement = event.target.closest(".task");
  if (taskElement === null) return;

  const taskTimerElement = taskElement.querySelector(".task-timer");
  taskTimerElement.textContent = "00:00:00";

  stopTimer(taskElement);
}

// Event listeners
add

```

### Analysis

First thing to note, ChatGPT dropped the ball here and did not finish the script but it probably was not going to add anything important anyways. But what really irked me was the usage of undefined methods: `getTimeInSeconds` and `getTimeStringFromSeconds` are not standard JavaScript methods and also not supplied in the provided script. It was at this point that I realized it would be better to take matters in my own hands. I already had the basic code there, I just needed to improve upon it.