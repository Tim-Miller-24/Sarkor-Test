<script lang="ts" setup>
import { ListStore } from '@/store/todoList';

const store = ListStore();

const router = useRouter();

const route = useRoute();

const tasksBeforeEditing = ref<string[]>([]);

const complitedTasksBeforeEditing = ref<string[]>([]);

const checkedTasks = ref<string[]>([]);

const documentReady = ref(false);

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
        complitedTasksBeforeEditing.value = store.lists[store.id].complitedTasks;

        documentReady.value = true;
    }

})

onBeforeUnmount(() => {
    documentReady.value = false;
})

function saveLists() {
    if (store.getTodoList(store.id).length == 0) {
        ElMessage({
            message: 'You must add at least 1 note',
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
</script>

<template>
    <div class="container list-box" v-if="documentReady">

        <div class="list-content">
            <div class="list-changes-buttons">
                <el-button @click="saveLists" type="success" plain>Save</el-button>
                <el-popconfirm title="Are you sure to cancel editing?" @confirm="cancelEditingList">
                    <template #reference>
                        <el-button type="danger" plain>Cancel</el-button>
                    </template>
                </el-popconfirm>

            </div>
    
            <TodoDetails :docReady="documentReady" />

        </div>
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/main';


</style>