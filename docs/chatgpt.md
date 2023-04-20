# TaskTimer

I wanted to try out if ChatGPT could write a (IMHO) simple application for me.

Basically I want to track the time spent on multiple task via a timer. For this I wanted to add tasks with just a title and a start / stop button to start / stop the corresponding timer. It should run inside the browser and not persist data I don't need that.

Nothing fancy, it should just work in a first iteration and I'd be building upon that to do some tinkering with JavaScript.

Following you will find my escapades with ChatGPT in producing the basic code, as well as the improvements I made upon that product.

## 1. First Iteration (after 2 attempts)

Actually this is the third iteration as ChatGPT first gave me an incomplete JavaScript Code and then after asking for the rest gave me complete other code that did not match the HTML.

### 1.1 Prompt

> I need to be able to track time for individual tasks. Each Task has a name and summed time. Write me an application where I can add a task with name and track time with a stopwatch like function. This application should run in a browser. It does not need to persist the data.

### 1.2 Result

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

### 1.3 Analysis

I was not really happy with this solution. As it only provides one timer for all tasks which is not really what I wanted. Rereading my prompt I see my mistake: I should have specifically stated, that each added task should have it's own timer.

## 2. Second Iteration

### 2.1 Prompt

> The task should be added first and then I should be able to start/stop the timer for each task individually in the list.

### 2.2 Result

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

### 2.3 Analysis

Basically this would work. The code would display NaN:NaN:NaN as initial time though which is ugly and would not work for ticking as the code uses the text as basis for the timer. This is already a no-go as it a form of *magic strings* which should not be done in proper programming. I analyzed the problem and attempted to formulate a prompt which would lead to a working solution. I did not want to write code myself yet. Another problem was that there would only be one active timer: there is only one **activeTaskId**.

## 3. Third Iteration

### 3.1 Prompt

> With this code the taskTimerElement is initially not set which leads to the timer not properly counting up. Furthermore only one task can have a running timer due to usage of activeTaskId. Instead each task should be able to run individually.

### 3.2 Result

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

### 3.3 Analysis

First thing to note, ChatGPT dropped the ball here and did not finish the script but it probably was not going to add anything important anyways. But what really irked me was the usage of undefined methods: `getTimeInSeconds` and `getTimeStringFromSeconds` are not standard JavaScript methods and also not supplied in the provided script. It was at this point that I realized it would be better to take matters in my own hands. I already had the basic code there, I just needed to improve upon it.

## 4. The fix (working solution)

For this I used the *working* code of [iteration 2](#22-result). It's not pretty and still uses *magic strings* to keep track of time but I would be fix that later.

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
    if (taskElement === null || taskElement.intervalId !== undefined) {
        // Element does not exist OR
        // A timer is already running for this task
        return;
    }

    taskElement.intervalId = setInterval(() => {
        const taskTimerElement = taskElement.querySelector(".task-timer");
        const [hours, minutes, seconds] = taskTimerElement.textContent.split(":").map(parseFloat);
        const newSeconds = seconds + 1;
        const newMinutes = minutes + Math.floor(newSeconds / 60);
        const newHours = hours + Math.floor(newMinutes / 60);
        const timerText = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:${(newSeconds % 60).toString().padStart(2, "0")}`;
        taskTimerElement.textContent = timerText;
    }, 1000);

    taskElement.classList.add("active-task");
}

// Function to stop the timer for a task
function stopTimer(event) {
    const taskElement = event.target.closest(".task");
    if (taskElement === null || taskElement.intervalId === undefined) {
        // Element does not exist OR
        // no timer is running for this task
        return;
    }

    clearInterval(taskElement.intervalId);
    taskElement.intervalId = undefined;

    taskElement.classList.remove("active-task");
}

// Function to reset the timer for a task
function resetTimer(event) {
    const taskElement = event.target.closest(".task");
    if (taskElement === null) return;

    const taskTimerElement = taskElement.querySelector(".task-timer");
    taskTimerElement.textContent = "00:00:00";

    stopTimer(event);
}

// Event listeners
addTaskBtn.addEventListener("click", addTask);
```

Notable changes were made in the core methods: **startTimer**, **stopTimer**, **resetTimer**.
Instead of providing the element directly I used the **event** of the click event to find the closest element having the **.task** class. As every task would have it's own buttons contained within a div, this was the easiest way to find the container element.
Furthermore I would track the interval on the **taskElement**, thus enabling each task to have it's own running timer.
Basically I now had a working solution. Not pretty in code (CSS is the least important thing here) but it works and does what I wanted.

## 5. Introducing a Task class (app improvement)

The next step for me was to now introduce a JavaScript class to do all the handling to make the application less hacky and look more PRO.

### The Task class

The class would look like this:

```javascript
class Task {
    constructor(name) {
        this.name = name;
        this.taskContainer = this.createElement();
        // keep track of the interval for the task
        this.intervalId = undefined;
        // keep track of the seconds of the timer so as not to use magic strings
        this.seconds = 0;
    }

    // create the whole html element and attach all click handlers
    createElement();

    // start the timer for the current task object
    startTimer();

    // stop the timer for the current task object
    stopTimer();

    // reset the timer for the current task object
    resetTimer();
}
```

### Introducing the Task class into the working code

This enabled me to keep all tasks in an array for later shenanigans like sum of all timers or some such. The code builds upon the logic of [the fix](#4-the-fix-working-solution) and introduces usage of the task class.

```javascript
const tasks = Array();

// Function to create a new task element
function createTaskElement(taskName) {
    let task = new Task(taskName);
    tasks.push(task);
    return task.taskContainer;
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

// Event listeners
addTaskBtn.addEventListener("click", addTask);
```

### createElement method

This method is mostly unchanged from the previous working version. The only difference is the hook-up of the click listeners as they should always use the context of the current object they are attached to. Thus a binding of **this** needed to be made.

```javascript
createElement() {
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
    taskNameSpan.textContent = this.name;
    taskTimerSpan.classList.add("task-timer");
    taskTimerSpan.textContent = "00:00:00";
    taskActionsSpan.classList.add("task-actions");
    startBtn.textContent = "Start";
    startBtn.addEventListener("click", this.startTimer.bind(this));
    stopBtn.textContent = "Stop";
    stopBtn.addEventListener("click", this.stopTimer.bind(this));
    resetBtn.textContent = "Reset";
    resetBtn.addEventListener("click", this.resetTimer.bind(this));

    // Append elements to task container
    taskContainer.appendChild(taskNameSpan);
    taskContainer.appendChild(taskTimerSpan);
    taskActionsSpan.appendChild(startBtn);
    taskActionsSpan.appendChild(stopBtn);
    taskActionsSpan.appendChild(resetBtn);
    taskContainer.appendChild(taskActionsSpan);

    return taskContainer;
}
```

### startTimer method

As the method is already within the context of the task I do not need to find the surrounding HTML-element. This results in reduced code. Furthermore the previous magic string usage for tracking the time was rewritten to use the **seconds** property of the task and the string to be displayed can be generated via the **Date** class.

```javascript
startTimer() {
    if (this.intervalId !== undefined) {
        // A timer is already running for this task
        return;
    }

    this.intervalId = setInterval(() => {
        this.seconds += 1000;
        const taskTimerElement = this.taskContainer.querySelector(".task-timer");
        const timerText = new Date(this.seconds).toISOString().slice(11,19);
        taskTimerElement.textContent = timerText;
    }, 1000);

    this.taskContainer.classList.add("active-task");
}
```

### stopTimer method

Same situation: reduced code due to precise context.

```javascript
stopTimer() {
    if (this.intervalId === undefined) {
        // no timer is running for this task
        return;
    }

    clearInterval(this.intervalId);
    this.intervalId = undefined;

    this.taskContainer.classList.remove("active-task");
}
```

### resetTimer method

Same situation: reduced code due to precise context. Only change the **seconds** property of the task is reset as well as this is the basis for the display. I still need to reset the display though as the call to **stopTimer** only kills the interval but does not change the displayed time.

```javascript
resetTimer() {
    const taskTimerElement = this.taskContainer.querySelector(".task-timer");
    taskTimerElement.textContent = "00:00:00";
    this.seconds = 0;
    this.stopTimer();
}
```

## 6. Conclusion

That's it. Nothing fancy just a fun small thing to do for one specific use-case I have. Nothing needs to be installed. I'll probably do some further improvements as I see fit to practice my basic JavaScript skills. I know it can be done *prettier* with react.js and the likes but I wanted to do plain old JavaScript and this seems like a nice playground to do this.
