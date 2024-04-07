import { defineStore } from "pinia";

export const ListStore = defineStore('todoList', {
    state: () => ({
        lists: [] as ToDoList[],
        id: 0
    }),
    actions: {
        createList() {
            this.lists.push({
                id: this.id,
                tasks: [] as string[],
                complitedTasks: [] as string[],
            });
        },
        addTask(task: string, id: number) {
            this.lists[id].tasks.push(task);
            this.saveList(id);
        },
        removeTask(index: number, id: number) {
            this.lists[id].tasks.splice(index, 1);
            console.log(this.lists[this.id].tasks);
            this.saveList(id);
        },
        editTask(index: number, text: string, id: number) {
            let complitedTaskId = this.lists[id].complitedTasks.indexOf(this.lists[id].tasks[index]);
            this.lists[id].tasks.splice(index, 1, text);

            if (this.lists[id].complitedTasks.length > 0) {
                this.lists[id].complitedTasks.splice(complitedTaskId, 1, text);
            }

            this.saveList(id);
        },
        saveList(id: number) {
            localStorage.setItem(`todoList${id}`, JSON.stringify(this.lists[id].tasks));
            localStorage.setItem(`comlitedTasks${id}`, JSON.stringify(this.lists[id].complitedTasks));
        },
        saveAllLists() {
            localStorage.setItem('allLists', JSON.stringify(this.lists))
            
        },
        removeList(id: number) {
            this.lists = this.getAllLists();

            this.lists.splice(id, 1);

            localStorage.removeItem(`todoList${id}`);
            localStorage.removeItem(`comlitedTasks${id}`);

            localStorage.setItem('allLists', JSON.stringify(this.lists));


            this.lists = this.getAllLists();

            for (let list of this.lists) {
                if (list.id > id) {
                    localStorage.removeItem(`todoList${id + list.id}`);
                    localStorage.removeItem(`comlitedTasks${id + list.id}`);

                    list.id--;

                    localStorage.removeItem(`todoList${id + list.id}`);
                    localStorage.removeItem(`comlitedTasks${id + list.id}`);

                    localStorage.setItem(`todoList${list.id}`, JSON.stringify(this.lists[list.id].tasks));
                    localStorage.setItem(`comlitedTasks${list.id}`, JSON.stringify(this.lists[list.id].complitedTasks));
                } 
            }
            
            this.id--;
            localStorage.setItem('allLists', JSON.stringify(this.lists));

            if (this.lists.length == 0) {
                this.id = 0;
            }
        },
        cancelEditingList(id: number, existTasks: string[], comlitedTasks: string[]) {
            localStorage.setItem(`todoList${id}`, JSON.stringify(existTasks));
            localStorage.setItem(`comlitedTasks${id}`, JSON.stringify(comlitedTasks));
        },
        getAllLists() {
            let temp = localStorage.getItem(`allLists`);

            if (temp !== null) {
                return JSON.parse(temp);
            }
            else {
                return [];
            }
        },
        getTodoList(id: number) {
            let tempList = localStorage.getItem(`todoList${id}`);

            if (tempList !== null) {
                return JSON.parse(tempList);
            }
            else {
                return [];
            }
        },
        getComplitedTasks(id: number) {
            let tempTasks = localStorage.getItem(`comlitedTasks${id}`);

            if (tempTasks !== null) {
                return JSON.parse(tempTasks);
            }
            else {
                return [];
            }
        }
    }
})