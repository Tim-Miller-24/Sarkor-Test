<script lang="ts" setup>
import { ListStore } from '@/store/todoList';
import { Check, Delete, Edit, Close, } from '@element-plus/icons-vue';

const store = ListStore();

const route = useRoute();

const router = useRouter();

const input = ref('');

const editInput = ref('');

const tasksBeforeEditing = ref<string[]>([]);

const complitedTasksBeforeEditing = ref<string[]>([]);

const isEditingTask = ref(false);

const indexOfEditingTask = ref();

const documentReady = ref(false);

const checkedTasks = ref<string[]>([]);

function addTask() {
    if (input.value.trim().length == 0) {
        ElMessage({
            message: 'Поле не может быть пустым',
            type: 'warning',
        });
        input.value = '';
        return;
    }

    store.addTask(input.value.trim(), store.id);
    input.value = '';
}

function editTask(index: number) {
    indexOfEditingTask.value = index;
    isEditingTask.value = true;
}

function removeTask(index: number, task: string | never) {
    if (checkedTasks.value.includes(task)) {
        ElMessage({
            message: 'Нельзя удалить выполененное дело',
            type: 'warning',
        })
        return;
    }


    store.removeTask(index, store.id);
}

function saveEdit(index: number, text: string) {
    if (editInput.value.trim().length == 0) {
        ElMessage({
            message: 'Изменённое поле не может быть пустым',
            type: 'warning',
        });

        editInput.value = '';
        return;
    }

    store.editTask(index, text.trim(), store.id);
    editInput.value = '';
    isEditingTask.value = false;
}

function canselEditingTask() {
    isEditingTask.value = false;
    editInput.value = '';
}

function saveLists() {
    if (store.getTodoList(store.id).length == 0) {
        ElMessage({
            message: 'Нужно добавить хотя бы 1 заметку',
            type: 'warning',
        })
        return;
    }

    store.saveAllLists();
    router.push('/');
}

function cancelEditingList() {
    if (route.query.creating) {
        store.removeList(store.id);
    }

    if (route.query.editing) {
        console.log(store.id);
        store.cancelEditingList(store.id, tasksBeforeEditing.value, complitedTasksBeforeEditing.value);
        store.id++;
    }

    router.push('/');
}

onMounted(() => {

    if (route.query.creating) {
        store.createList();
        console.log(store.id);
        store.lists[store.id].tasks = store.getTodoList(store.id);
        checkedTasks.value = store.getComplitedTasks(store.id);

        documentReady.value = true;
    }

    if (route.query.editing) {
        store.lists = store.getAllLists();

        store.id = Number(route.query.editing);

        store.lists[store.id].tasks = store.getTodoList(store.id);
        checkedTasks.value = store.getComplitedTasks(store.id);

        tasksBeforeEditing.value = store.getTodoList(store.id);
        complitedTasksBeforeEditing.value = store.getComplitedTasks(store.id);

        documentReady.value = true;
    }

})

onUpdated(() => {
    store.lists[store.id].complitedTasks = checkedTasks.value;
    store.saveList(store.id);
})

onUnmounted(() => {
    documentReady.value = false;
})
</script>

<template>
    <el-button @click="saveLists" type="success" :icon="Check" circle />
    <el-popconfirm title="Are you sure to cancel editing?" @confirm="cancelEditingList">
        <template #reference>
            <el-button type="danger" :icon="Close" circle />
        </template>
    </el-popconfirm>

    <div class="container" v-if="documentReady">
        <h3>Список дел</h3>

        <ul v-for="(task, index) in store.lists[store.id].tasks" :key="index">
            <li>
                <input type="checkbox" :id="task" v-model="checkedTasks" :value="task">

                <label :for="task" v-if="!isEditingTask"> {{ task }} </label>
                <label :for="task" v-else-if="isEditingTask && index != indexOfEditingTask"> {{ task }} </label>

                <input v-else-if="isEditingTask && index == indexOfEditingTask" v-model="editInput" :placeholder="task">


                <span v-if="!isEditingTask">
                    <el-button @click="editTask(index)" type="primary" :icon="Edit" circle />

                    <el-popconfirm title="Are you sure to delete this?" @confirm="removeTask(index, task)">
                        <template #reference>
                            <el-button type="danger" :icon="Delete" circle />
                        </template>
                    </el-popconfirm>
                </span>


                <span v-else-if="isEditingTask && index == indexOfEditingTask">
                    <el-button @click="saveEdit(index, editInput)" type="success" :icon="Check" circle />

                    <el-popconfirm title="Are you sure to cancel editing?" @confirm="canselEditingTask">
                        <template #reference>
                            <el-button type="danger" :icon="Close" circle />
                        </template>
                    </el-popconfirm>
                </span>

            </li>
        </ul>

        <br><br>


        <el-input v-model="input" @keydown.enter="addTask" style="width: 240px" learable />
        <button @click="addTask">add task</button>
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/main';
</style>