<script lang="ts" setup>
import { ListStore } from '@/store/todoList';
import { Check, Delete, Edit, Close, } from '@element-plus/icons-vue';

const store = ListStore();

const router = useRouter();

type ToDoList = {
    id: number,
    tasks: string[],
    complitedTasks: string[],
}

const taskList = ref<ToDoList[]>([]);

onMounted(() => {
    taskList.value = store.getAllLists();

    for (let list of taskList.value) {
        if (Object.keys(list).length == 0) {
            taskList.value.splice(taskList.value.indexOf(list), 1);
        }
    }

})

function editList(id: number) {
    router.push('/todo?editing=' + id);
}

function deleteList(id: number) {
    store.removeList(id);

    taskList.value = store.getAllLists();

}
</script>

<template>
    <div class="container box">

        <div class="" v-for="list in taskList">
            <el-card style="max-width: 480px; width: 100%">
                <template #header>
                    <div class="card-header">
                        <h3>Заметка</h3>
                    </div>
                </template>

                <div class="text item" v-for="(task, index) in list.tasks" :key="index">
                    <b v-if="index <= 3"> {{ task }} </b>
                    <i v-if="index > 3 && index <= 4"> more... </i>
                </div>

                <template #footer>
                    <el-button @click="editList(list.id)" type="primary" :icon="Edit" circle />

                    <el-popconfirm title="Are you sure to delete this?" @confirm="deleteList(list.id)">
                        <template #reference>
                            <el-button type="danger" :icon="Delete" circle />
                        </template>
                    </el-popconfirm>
                </template>

            </el-card>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/main';

.box {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
}
</style>