document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const prioritySelect = document.getElementById('priority');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filters = document.querySelectorAll('.filter');

    // Charger les tâches existantes
    loadTasks();

    // Ajouter une tâche
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = prioritySelect.value;

        if (taskText) {
            addTask(taskText, dueDate, priority);
            taskInput.value = '';
            dueDateInput.value = '';
            prioritySelect.value = 'low';
            saveTasks();
        }
    });

    // Marquer une tâche comme complétée
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('complete')) {
            const li = e.target.closest('li');
            li.classList.toggle('completed');
            saveTasks();
        }

        if (e.target.classList.contains('delete')) {
            e.target.parentElement.remove();
            saveTasks();
        }
    });

    // Filtrer les tâches
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterType = filter.dataset.filter;
            filterTasks(filterType);
        });
    });

    function addTask(task, dueDate, priority) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task}</span>
            <span class="priority ${priority}">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
            <button class="complete">Complète</button>
            <button class="delete">Supprimer</button>
        `;
        if (dueDate) {
            const dateSpan = document.createElement('span');
            dateSpan.textContent = `Échéance: ${dueDate}`;
            dateSpan.classList.add('due-date');
            li.appendChild(dateSpan);
        }
        taskList.appendChild(li);
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach((li) => {
            const taskText = li.querySelector('span').textContent;
            const isCompleted = li.classList.contains('completed');
            const dueDate = li.querySelector('.due-date') ? li.querySelector('.due-date').textContent : '';
            const priority = li.querySelector('.priority').classList[1];
            tasks.push({ taskText, isCompleted, dueDate, priority });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => addTask(task.taskText, task.dueDate, task.priority));
            taskList.querySelectorAll('li').forEach((li) => {
                if (li.dataset.completed === 'true') {
                    li.classList.add('completed');
                }
            });
        }
    }

    function filterTasks(filterType) {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach((task) => {
            const isCompleted = task.classList.contains('completed');
            switch (filterType) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'completed':
                    task.style.display = isCompleted ? 'flex' : 'none';
                    break;
                case 'pending':
                    task.style.display = !isCompleted ? 'flex' : 'none';
                    break;
            }
        });
    }
});
