document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const isAddTaskPage = document.getElementById('taskForm') !== null;
    const isTasksPage = document.getElementById('tasksList') !== null;

    if (isAddTaskPage) {
        initAddTaskPage();
    } else if (isTasksPage) {
        initTasksPage();
    }

    function initAddTaskPage() {
        // DOM Elements
        const taskForm = document.getElementById('taskForm');
        const cancelBtn = document.getElementById('cancelBtn');
        const saveDraftBtn = document.getElementById('saveDraftBtn');
        const reminderEnabled = document.getElementById('reminderEnabled');
        const reminderTimeContainer = document.getElementById('reminderTimeContainer');
        const categoryTags = document.querySelectorAll('.tag');
        const categoryInput = document.getElementById('category');
        const notification = document.getElementById('notification');

        // Initialize form
        initForm();

        // Event Listeners
        reminderEnabled.addEventListener('change', function() {
            reminderTimeContainer.style.display = this.checked ? 'block' : 'none';
        });

        categoryTags.forEach(tag => {
            tag.addEventListener('click', function() {
                categoryTags.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                categoryInput.value = this.getAttribute('data-value');
            });
        });

        cancelBtn.addEventListener('click', function() {
            if(confirm('Are you sure you want to discard this task?')) {
                window.location.href = 'tasks.html';
            }
        });

        saveDraftBtn.addEventListener('click', function() {
            saveTask(true);
        });

        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveTask(false);
        });

        // Functions
        function initForm() {
            // Set default category
            document.querySelector('.tag[data-value="work"]').classList.add('active');
            categoryInput.value = 'work';

            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('dueDate').valueAsDate = tomorrow;

            // Hide reminder time initially
            reminderTimeContainer.style.display = 'none';
        }

        function saveTask(isDraft) {
            const taskData = {
                id: Date.now(), // Unique ID for each task
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                dueDate: document.getElementById('dueDate').value,
                priority: document.getElementById('priority').value,
                category: categoryInput.value,
                hasReminder: reminderEnabled.checked,
                reminderTime: reminderEnabled.checked ? document.getElementById('reminderTime').value : null,
                isDraft: isDraft,
                createdAt: new Date().toISOString()
            };

            // Get existing tasks
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // Add new task
            tasks.push(taskData);
            
            // Save to localStorage
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // Show notification
            showNotification(isDraft ? 'Draft saved successfully!' : 'Task added successfully!');

            // Reset form if not draft
            if (!isDraft) {
                setTimeout(() => {
                    window.location.href = 'tasks.html';
                }, 1500);
            }
        }
    }

    function initTasksPage() {
        // DOM Elements
        const tasksList = document.getElementById('tasksList');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const notification = document.getElementById('notification');

        // Check if we're coming from add task with a success message
        const urlParams = new URLSearchParams(window.location.search);
        const successMessage = urlParams.get('success');
        
        if (successMessage) {
            showNotification(successMessage);
            // Clean the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Load and render tasks
        loadAndRenderTasks();

        // Event Listeners for filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter tasks
                const filter = this.getAttribute('data-filter');
                loadAndRenderTasks(filter);
            });
        });

        // Functions
        function loadAndRenderTasks(filter = 'all') {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // Filter tasks if needed
            if (filter !== 'all') {
                tasks = tasks.filter(task => task.category === filter);
            }
            
            // Sort by due date (ascending)
            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            
            renderTasks(tasks);
        }

        function renderTasks(tasks) {
            tasksList.innerHTML = '';
            
            if (tasks.length === 0) {
                tasksList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-tasks"></i>
                        <h3>No tasks found</h3>
                        <p>${document.querySelector('.filter-btn.active').textContent === 'All' 
                            ? 'You have no tasks yet. Add a new task to get started!' 
                            : 'No tasks in this category.'}</p>
                    </div>
                `;
                return;
            }
            
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task-card ${task.category}`;
                
                const dueDate = new Date(task.dueDate);
                const formattedDate = dueDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: dueDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                });
                
                taskElement.innerHTML = `
                    <div class="task-actions">
                        <button class="delete-task" data-id="${task.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <h3>${task.title}</h3>
                    <p>${task.description || 'No description'}</p>
                    <div class="task-meta">
                        <span class="category">
                            <i class="fas fa-tag"></i> ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                        </span>
                        <span class="due-date">
                            <i class="far fa-calendar-alt"></i> ${formattedDate}
                        </span>
                        <span class="priority ${task.priority}">
                            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        ${task.hasReminder ? `
                        <span class="reminder">
                            <i class="fas fa-bell"></i> ${task.reminderTime}
                        </span>` : ''}
                        ${task.isDraft ? '<span class="draft-badge">Draft</span>' : ''}
                    </div>
                `;
                
                tasksList.appendChild(taskElement);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-task').forEach(button => {
                button.addEventListener('click', function() {
                    const taskId = parseInt(this.getAttribute('data-id'));
                    deleteTask(taskId);
                });
            });
        }

        function deleteTask(taskId) {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadAndRenderTasks(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
            showNotification('Task deleted successfully!');
        }
    }

    // Shared function
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});