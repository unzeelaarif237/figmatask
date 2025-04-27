document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const sidebar = document.querySelector('.sidebar');
    const addTaskBtn = document.querySelector('.add-task-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModalBtn = document.querySelector('.close-modal');
    const taskForm = document.getElementById('task-form');
    const taskListContainer = document.querySelector('.task-list-container');
    
    // Set current date
    const dateElement = document.querySelector('.date-text');
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = currentDate.toLocaleDateString('en-US', options);
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Add task modal
    addTaskBtn.addEventListener('click', function() {
        modalOverlay.classList.add('active');
    });
    
    closeModalBtn.addEventListener('click', function() {
        modalOverlay.classList.remove('active');
    });
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
    
    // Task form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskName = document.getElementById('task-name').value;
        const taskDate = document.getElementById('task-date').value;
        const taskTime = document.getElementById('task-time').value;
        const taskPriority = document.getElementById('task-priority').value;
        
        // Format time (convert 24h to 12h)
        const timeParts = taskTime.split(':');
        let hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedTime = `${hours}:${minutes} ${ampm}`;
        
        // Create new task element
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        let priorityClass = '';
        let priorityText = '';
        
        switch(taskPriority) {
            case 'high':
                priorityClass = 'priority-high';
                priorityText = 'High';
                break;
            case 'medium':
                priorityClass = 'priority-medium';
                priorityText = 'Medium';
                break;
            case 'low':
                priorityClass = 'priority-low';
                priorityText = 'Low';
                break;
        }
        
        taskItem.innerHTML = `
            <div class="task-info">
                <input type="checkbox" class="task-checkbox">
                <span class="task-name">${taskName}</span>
                <span class="task-time">${formattedTime}</span>
            </div>
            <span class="task-priority ${priorityClass}">${priorityText}</span>
        `;
        
        // Add to task list (at the top)
        const firstTask = taskListContainer.querySelector('.task-item');
        if (firstTask) {
            taskListContainer.insertBefore(taskItem, firstTask);
        } else {
            taskListContainer.appendChild(taskItem);
        }
        
        // Update task count
        updateTaskCount();
        
        // Reset form and close modal
        taskForm.reset();
        modalOverlay.classList.remove('active');
        
        // Add event listener to new checkbox
        const newCheckbox = taskItem.querySelector('.task-checkbox');
        newCheckbox.addEventListener('change', handleTaskCompletion);
    });
    
    // Task completion handler
    function handleTaskCompletion(e) {
        const taskName = this.nextElementSibling;
        if (this.checked) {
            taskName.classList.add('completed');
        } else {
            taskName.classList.remove('completed');
        }
        updateTaskCount();
    }
    
    // Update task count
    function updateTaskCount() {
        const totalTasks = document.querySelectorAll('.task-item').length;
        const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
        const pendingTasks = totalTasks - completedTasks;
        
        document.querySelector('.task-count').textContent = `${totalTasks} tasks`;
        
        // Update dashboard cards (simplified - in real app you'd have more complex logic)
        document.querySelector('.card-value:nth-child(1)').textContent = totalTasks;
        document.querySelector('.card-value:nth-child(2)').textContent = completedTasks;
        document.querySelector('.card-value:nth-child(3)').textContent = pendingTasks;
    }
    
    // Initialize task checkboxes
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleTaskCompletion);
    });
    
    // Calendar functionality
    const calendarNavLeft = document.querySelector('.calendar-nav-btn:first-child');
    const calendarNavRight = document.querySelector('.calendar-nav-btn:last-child');
    const calendarTodayBtn = document.querySelector('.calendar-nav-btn:nth-child(2)');
    const calendarTitle = document.querySelector('.calendar-title');
    
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Update calendar view
    function updateCalendar() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
        calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Highlight current day
        const days = document.querySelectorAll('.calendar-day:not(.other-month)');
        days.forEach(day => {
            day.classList.remove('current-day');
            if (parseInt(day.textContent) === currentDate.getDate() && 
                currentMonth === currentDate.getMonth() && 
                currentYear === currentDate.getFullYear()) {
                day.classList.add('current-day');
            }
        });
    }
    
    // Calendar navigation events
    calendarNavLeft.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });
    
    calendarNavRight.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
    
    calendarTodayBtn.addEventListener('click', function() {
        currentMonth = currentDate.getMonth();
        currentYear = currentDate.getFullYear();
        updateCalendar();
    });
    
    // Initialize calendar
    updateCalendar();
    
    // Click events for calendar days with tasks
    const daysWithTasks = document.querySelectorAll('.has-tasks');
    daysWithTasks.forEach(day => {
        day.addEventListener('click', function() {
            alert(`Showing tasks for ${currentMonth + 1}/${this.textContent}/${currentYear}`);
        });
    });
    
    // Initialize task count
    updateTaskCount();
});