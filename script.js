document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearTasks = document.getElementById("clearTasks");
const filterBtns = document.querySelectorAll(".filter-btn");

addTaskBtn.addEventListener("click", addTask);
taskList.addEventListener("click", manageTask);
clearTasks.addEventListener("click", clearAllTasks);
filterBtns.forEach(btn => btn.addEventListener("click", filterTasks));

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = { text: taskText, completed: false };
    saveTask(task);

    renderTask(task);
    taskInput.value = "";
}

function renderTask(task) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${task.text}</span>
        <div>
            <button class="check"><i class="fas fa-check"></i></button>
            <button class="delete"><i class="fas fa-trash"></i></button>
        </div>
    `;
    if (task.completed) li.classList.add("completed");
    taskList.appendChild(li);
}

function manageTask(event) {
    const item = event.target.closest("button");
    if (!item) return;

    const li = item.closest("li");
    const text = li.querySelector("span").textContent;

    if (item.classList.contains("check")) {
        li.classList.toggle("completed");
        updateTask(text, li.classList.contains("completed"));
    } else if (item.classList.contains("delete")) {
        li.remove();
        deleteTask(text);
    }
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(renderTask);
}

function updateTask(text, completed) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.map(task => task.text === text ? { ...task, completed } : task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(text) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAllTasks() {
    taskList.innerHTML = "";
    localStorage.removeItem("tasks");
}

function filterTasks(event) {
    const filter = event.target.dataset.filter;
    document.querySelector(".active").classList.remove("active");
    event.target.classList.add("active");

    const tasks = document.querySelectorAll("#taskList li");
    tasks.forEach(task => {
        switch (filter) {
            case "all":
                task.style.display = "flex";
                break;
            case "pending":
                task.style.display = task.classList.contains("completed") ? "none" : "flex";
                break;
            case "completed":
                task.style.display = task.classList.contains("completed") ? "flex" : "none";
                break;
        }
    });
}

