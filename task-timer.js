// Get HTML elements
const taskNameInput = document.getElementById("task-name");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

let tasks = Array();

class Task {
    constructor(name) {
        this.name = name;
        this.status = "stopped";
        this.taskContainer = this.createElement();
        this.intervalId = undefined;
    }

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

    startTimer() {
        console.log("Starting timer of: " + this.name);
    }

    stopTimer() {
        console.log("Stopping timer of: " + this.name);
    }

    resetTimer() {
        console.log("Resetting timer of: " + this.name);
    }
}

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
