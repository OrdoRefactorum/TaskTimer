// Get HTML elements
const taskNameInput = document.getElementById("task-name");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Array which holds all the tasks
const tasks = Array();

class Task {
    constructor(name) {
        this.name = name;
        this.intervalId = undefined;
        this.seconds = 0;
        this.createElement();
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
        const deleteBtn = document.createElement("button");

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
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", this.deleteTask.bind(this));

        // Append elements to task container
        taskContainer.appendChild(taskNameSpan);
        taskContainer.appendChild(taskTimerSpan);
        taskActionsSpan.appendChild(startBtn);
        taskActionsSpan.appendChild(stopBtn);
        taskActionsSpan.appendChild(resetBtn);
        taskActionsSpan.appendChild(deleteBtn);
        taskContainer.appendChild(taskActionsSpan);

        this.taskContainer = taskContainer;
        this.timerElement = taskTimerSpan;
    }

    startTimer() {
        if (this.intervalId !== undefined) {
            // A timer is already running for this task
            return;
        }

        this.intervalId = setInterval(() => {
            this.seconds += 1000;
            const timerText = new Date(this.seconds).toISOString().slice(11, 19);
            this.timerElement.textContent = timerText;
        }, 1000);

        this.taskContainer.classList.add("active-task");
    }

    stopTimer() {
        if (this.intervalId === undefined) {
            // no timer is running for this task
            return;
        }

        clearInterval(this.intervalId);
        this.intervalId = undefined;

        this.taskContainer.classList.remove("active-task");
    }

    resetTimer() {
        this.timerElement.textContent = "00:00:00";
        this.seconds = 0;
        this.stopTimer();
    }

    deleteTask() {
        this.stopTimer();
        const indexToRemove = tasks.findIndex((task => task.name == this.name));
        tasks.splice(indexToRemove, 1);
        taskList.removeChild(this.taskContainer);
    }

    toString() {
        return `${this.name} has been running for: ${new Date(this.seconds).toISOString().slice(11, 19)}`;
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

    if (taskName.includes(";")) {
        taskName.split(";").forEach(name => {
            createTask(name.trim());
        });
    } else {
        createTask(taskName.trim());
    }

    // Clear task name input
    taskNameInput.value = "";
}

function createTask(taskName) {
    // Create new task element
    const taskElement = createTaskElement(taskName);

    // Add task element to task list
    taskList.appendChild(taskElement);
}

// Event listeners
addTaskBtn.addEventListener("click", addTask);
