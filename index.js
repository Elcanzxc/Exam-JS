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