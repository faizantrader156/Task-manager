// ==========================================
// TASK MANAGER APP LOGIC (PROJECT #02)
// ==========================================

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const taskList = document.getElementById('task-list');
const tasksCount = document.getElementById('tasks-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

// Initialize State Array from LocalStorage
let tasks = JSON.parse(localStorage.getItem('faizan_tasks')) || [];
let currentFilter = 'all';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});

// Save Tasks to LocalStorage
function saveTasksToStorage() {
    localStorage.setItem('faizan_tasks', JSON.stringify(tasks));
}

// Render Tasks on Screen
function renderTasks() {
    taskList.innerHTML = '';

    // Filter tasks based on current tab selection
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all' filter
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<div class="empty-msg">No tasks found. Add a new task above!</div>`;
    } else {
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);

            li.innerHTML = `
                <div class="task-content" onclick="toggleTask('${task.id}')">
                    <div class="checkbox-icon">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <span class="task-text">${escapeHTML(task.text)}</span>
                </div>
                <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Delete Task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            taskList.appendChild(li);
        });
    }

    updateStats();
}

// Add New Task
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();

    if (text !== '') {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };

        tasks.unshift(newTask); // Add to top of list
        saveTasksToStorage();
        renderTasks();
        todoInput.value = '';
    }
});

// Toggle Task Complete Status
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });

    saveTasksToStorage();
    renderTasks();
}

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage();
    renderTasks();
}

// Clear All Completed Tasks
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasksToStorage();
    renderTasks();
});

// Filter Tabs Handling
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// Update Remaining Tasks Count
function updateStats() {
    const activeTasksCount = tasks.filter(task => !task.completed).length;
    tasksCount.textContent = `${activeTasksCount} task${activeTasksCount === 1 ? '' : 's'} remaining`;
}

// Sanitize HTML input for security
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}