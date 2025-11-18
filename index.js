class Task {
    #id;
    #title;
    #description;
    #createdAt;
    #completed;

    constructor(title, description) {
        this.#id = crypto.randomUUID();
        this.#title = title;
        this.#description = description;
        this.#createdAt = this.#getCurrentDateTime();
        this.#completed = false;
    }

    #getCurrentDateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    getDescription() {
        return this.#description;
    }

    getCreatedAt() {
        return this.#createdAt;
    }

    isCompleted() {
        return this.#completed;
    }

    setTitle(title) {
        this.#title = title;
    }

    setDescription(description) {
        this.#description = description;
    }

    toggleCompleted() {
        this.#completed = !this.#completed;
    }

    setCompleted(value) {
        this.#completed = value;
    }

    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            createdAt: this.#createdAt,
            completed: this.#completed
        };
    }

    static fromJSON(json) {
        const task = new Task(json.title, json.description);
        task.#id = json.id;
        task.#createdAt = json.createdAt;
        task.#completed = json.completed;
        return task;
    }
}





class TaskList {
    #tasks;

    constructor() {
        this.#tasks = [];
        this.loadFromStorage();
    }

    addTask(task) {
        this.#tasks.push(task);
        this.saveToStorage();
    }

    removeTask(id) {
        this.#tasks = this.#tasks.filter(task => task.getId() !== id);
        this.saveToStorage();
    }

    getTaskById(id) {
        return this.#tasks.find(task => task.getId() === id);
    }

    updateTask(id, title, description) {
        const task = this.getTaskById(id);
        if (task) {
            task.setTitle(title);
            task.setDescription(description);
            this.saveToStorage();
        }
    }

    toggleTaskCompleted(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.toggleCompleted();
            this.saveToStorage();
        }
    }

    getAllTasks() {
        return [...this.#tasks];
    }

    getFilteredTasks(filter) {
        switch(filter) {
            case 'completed':
                return this.#tasks.filter(task => task.isCompleted());
            case 'uncompleted':
                return this.#tasks.filter(task => !task.isCompleted());
            default:
                return this.#tasks;
        }
    }

    getSortedTasks(tasks, sortBy) {
        const tasksCopy = [...tasks];
        
        if (sortBy === 'date') {
            return tasksCopy.sort((a, b) => {
                const dateA = this.#parseDate(a.getCreatedAt());
                const dateB = this.#parseDate(b.getCreatedAt());
                return dateB - dateA;
            });
        } else if (sortBy === 'name') {
            return tasksCopy.sort((a, b) => 
                a.getTitle().localeCompare(b.getTitle(), 'ru')
            );
        }
        
        return tasksCopy;
    }

    #parseDate(dateStr) {
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('.');
        const [hours, minutes, seconds] = timePart.split(':');
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    saveToStorage() {
        const tasksJSON = this.#tasks.map(task => task.toJSON());
        localStorage.setItem('tasks', JSON.stringify(tasksJSON));
    }

    loadFromStorage() {
        const tasksJSON = localStorage.getItem('tasks');
        if (tasksJSON) {
            const parsed = JSON.parse(tasksJSON);
            this.#tasks = parsed.map(json => Task.fromJSON(json));
        }
    }
}



class Validator {
    static validateTitle(title) {

       
        const pattern = /^(?!(?:\s*\d+\s*)+$)(?=(?:\s*[a-zA-Z]+\s*|\s*[а-яА-ЯёЁ]+\s*|\s*\d+\s*)+$)(?:[a-zA-Z]{1,16}|[а-яА-ЯёЁ]{1,16}|\d{1,16})(?:\s(?:[a-zA-Z]{1,16}|[а-яА-ЯёЁ]{1,16}|\d{1,16}))+$/;
       
        return pattern.test(title.trim());
    }

    static validateDescription(description, title) {

      
        const wordPattern = /^(?:[a-zA-Z]{1,16}|[а-яА-ЯёЁ]{1,16}|\d{1,16})(?:\s+(?:[a-zA-Z]{1,16}|[а-яА-ЯёЁ]{1,16}|\d{1,16}))*$/;
        
        const trimmedDesc = description.trim();
        const trimmedTitle = title.trim();
        
       
        if (!wordPattern.test(trimmedDesc)) {
            return false;
        }
       
        return trimmedDesc !== trimmedTitle;
    }
}


document.addEventListener('DOMContentLoaded', () =>
{
        const taskList = new TaskList();
        let currentFilter = 'all';
        let currentSort = 'date';


        

function renderTaskList() {

    const taskListEl = document.getElementById('taskList');
    const filteredTasks = taskList.getFilteredTasks(currentFilter);
    const sortedTasks = taskList.getSortedTasks(filteredTasks, currentSort);


    taskListEl.textContent = ''; 

    if (sortedTasks.length === 0) {
        const p = document.createElement('p');
        p.style.textAlign = 'center';
        p.style.color = '#888';
        p.style.padding = '20px';
        p.textContent = 'Нет задач';
        taskListEl.appendChild(p);
        return;
    }


    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        if (task.isCompleted()) {
            li.classList.add('completed');
        }

     
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = task.isCompleted();
        checkbox.dataset.id = task.getId();

       
        checkbox.addEventListener('change', (e) => {
            taskList.toggleTaskCompleted(e.target.dataset.id);
            renderTaskList();
        });

       
        const titleLink = document.createElement('a');
        titleLink.href = `details.html?id=${task.getId()}`;
        titleLink.classList.add('task-title');
    
        titleLink.textContent = task.getTitle(); 

       
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('task-actions');

       
        const editLink = document.createElement('a');
        editLink.href = `edit.html?id=${task.getId()}`;
        editLink.classList.add('btn', 'btn-secondary', 'btn-edit');
        editLink.textContent = 'Изменить';

     
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-delete');
        deleteButton.dataset.id = task.getId();
        deleteButton.textContent = 'Удалить';

       
        deleteButton.addEventListener('click', (e) => {
            if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
                taskList.removeTask(e.target.dataset.id);
                renderTaskList();
            }
        });

        
        actionsDiv.appendChild(editLink);
        actionsDiv.appendChild(deleteButton);

     
        li.appendChild(checkbox);
        li.appendChild(titleLink);
        li.appendChild(actionsDiv);

      
        taskListEl.appendChild(li);
    });
    
}

const addTaskForm = document.getElementById('addTaskForm');
if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        
        const titleError = document.getElementById('titleError');
        const descriptionError = document.getElementById('descriptionError');
        
       
        if (titleError) titleError.textContent = '';
        if (descriptionError) descriptionError.textContent = '';

        let isValid = true;

        if (!Validator.validateTitle(title)) {
            if (titleError) {
                titleError.textContent = 'Название должно содержать минимум 2 слова, не может состоять только из чисел';
            }
            isValid = false;
        }

        if (!Validator.validateDescription(description, title)) {
            if (descriptionError) {
                descriptionError.textContent = 'Описание должно содержать минимум 1 слово и не совпадать с названием';
            }
            isValid = false;
        }

        if (isValid) {
          
            const task = new Task(title.trim(), description.trim());
            
           
            taskList.addTask(task);
            
          
            addTaskForm.reset();
            
            
            renderTaskList();
        }
    });
}
        

        renderTaskList();
});

