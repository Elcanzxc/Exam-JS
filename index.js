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