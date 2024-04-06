<script lang="ts" setup>
import { ListStore } from '@/store/todoList';
import { Check, Delete, Edit, Close, } from '@element-plus/icons-vue';

let props = defineProps(['docReady'])

const store = ListStore();

const input = ref('');

const editInput = ref('');

const isEditingTask = ref(false);

const checkedTasks = ref<string[]>([]);

const indexOfEditingTask = ref();

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

function saveEditTask(index: number, text: string) {
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

onMounted(() => {
    if (props.docReady) {
        checkedTasks.value = store.getComplitedTasks(store.id);
    }
})

onUpdated(() => {
    store.lists[store.id].complitedTasks = checkedTasks.value;
    store.saveList(store.id);
})

</script>

<template>
    <div class="container" v-if="props.docReady">
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
                    <el-button @click="saveEditTask(index, editInput)" type="success" :icon="Check" circle />

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