import { db, auth } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const progressInput = document.getElementById('progressInput');
    const addProgressButton = document.getElementById('addProgressButton');
    const progressList = document.getElementById('progressList');
    const filterAll = document.getElementById('filterAll');
    const filterActive = document.getElementById('filterActive');
    const filterCompleted = document.getElementById('filterCompleted');

    // Current user and filter state
    let currentUser = null;
    let currentFilter = 'all';

    // Initialize Firebase Auth
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            renderTasks();
        } else {
            // For demo purposes, we'll use anonymous auth
            auth.signInAnonymously()
                .catch(error => {
                    console.error("Authentication error:", error);
                    progressList.innerHTML = '<div class="loading">Error loading tasks. Please refresh.</div>';
                });
        }
    });

    // Event Listeners
    addProgressButton.addEventListener('click', addTask);
    progressInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    filterAll.addEventListener('click', () => changeFilter('all'));
    filterActive.addEventListener('click', () => changeFilter('active'));
    filterCompleted.addEventListener('click', () => changeFilter('completed'));

    // Functions
    function addTask() {
        const taskText = progressInput.value.trim();
        if (taskText && currentUser) {
            // Add task to Firestore
            db.collection('tasks').add({
                userId: currentUser.uid,
                text: taskText,
                completed: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                progressInput.value = '';
            })
            .catch(error => {
                console.error("Error adding task:", error);
                alert("Failed to add task. Please try again.");
            });
        }
    }

    function renderTasks() {
        if (!currentUser) {
            progressList.innerHTML = '<div class="loading">Loading tasks...</div>';
            return;
        }

        let query = db.collection('tasks')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt');

        // Apply filter
        if (currentFilter === 'active') {
            query = query.where('completed', '==', false);
        } else if (currentFilter === 'completed') {
            query = query.where('completed', '==', true);
        }

        // Get tasks from Firestore
        query.get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    progressList.innerHTML = '<div class="loading">No tasks found. Add your first task!</div>';
                    return;
                }

                progressList.innerHTML = '';
                querySnapshot.forEach(doc => {
                    const task = doc.data();
                    createTaskElement(doc.id, task.text, task.completed);
                });
            })
            .catch(error => {
                console.error("Error getting tasks:", error);
                progressList.innerHTML = '<div class="loading">Error loading tasks. Please refresh.</div>';
            });
    }

    function createTaskElement(id, text, completed) {
        const li = document.createElement('li');
        li.className = `progress-item ${completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span class="progress-text">${text}</span>
            <div class="progress-actions">
                <button class="progress-btn complete-btn" data-id="${id}">
                    <i class="fas fa-${completed ? 'undo' : 'check'}"></i>
                </button>
                <button class="progress-btn delete-btn" data-id="${id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        progressList.appendChild(li);

        // Add event listeners to the new buttons
        li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(id, !completed));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(id));
    }

    function toggleComplete(id, completed) {
        db.collection('tasks').doc(id).update({
            completed: completed,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(error => {
            console.error("Error updating task:", error);
            alert("Failed to update task. Please try again.");
        });
    }

    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            db.collection('tasks').doc(id).delete()
                .catch(error => {
                    console.error("Error deleting task:", error);
                    alert("Failed to delete task. Please try again.");
                });
        }
    }

    function changeFilter(filter) {
        currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`).classList.add('active');
        
        // Re-render tasks
        renderTasks();
    }

    // Stats animation
    const statValues = document.querySelectorAll('.stat-card p');
    statValues.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 20;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = current.toFixed(current % 1 !== 0 ? 1 : 0) + (stat.textContent.includes('+') ? '+' : '');
        }, 50);
    });
});