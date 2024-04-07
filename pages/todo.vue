<script lang="ts" setup>
import { ListStore } from '@/store/todoList';

const store = ListStore();

const router = useRouter();

const route = useRoute();

const tasksBeforeEditing = ref<string[]>([]);

const currentListId = ref(0);

const complitedTasksBeforeEditing = ref<string[]>([]);

const checkedTasks = ref<string[]>([]);

const documentReady = ref(false);

onMounted(() => {
    if (route.query.creating) {
        store.createList();
        
        currentListId.value = store.id;

        store.lists[store.id].tasks = store.getTodoList(store.id);
        checkedTasks.value = store.getComplitedTasks(store.id);

        documentReady.value = true;
    }

    if (route.query.editing) {
        store.lists = store.getAllLists();
        
        currentListId.value = Number(route.query.editing);

        store.lists[currentListId.value].tasks = store.getTodoList(currentListId.value);
        checkedTasks.value = store.getComplitedTasks(currentListId.value);

        tasksBeforeEditing.value = store.getTodoList(currentListId.value);
        complitedTasksBeforeEditing.value = store.lists[currentListId.value].complitedTasks;

        documentReady.value = true;
    }

})

onBeforeUnmount(() => {
    documentReady.value = false;
})

function saveLists() {
    if (store.getTodoList(currentListId.value).length == 0) {
        ElMessage({
            message: 'You must add at least 1 note',
            type: 'warning',
        })
        return;
    }

    if (route.query.creating) {
        store.saveAllLists();
        store.id++;
    }

    if (route.query.editing) {
        store.saveAllLists();
    }

    router.push('/');
}

function cancelEditingList() {
    if (route.query.creating) {
        store.removeList(currentListId.value);
    }

    if (route.query.editing) {
        currentListId.value = Number(route.query.editing);

        store.cancelEditingList(currentListId.value, tasksBeforeEditing.value, complitedTasksBeforeEditing.value);
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
    
            <TodoDetails :docReady="documentReady" :listId="currentListId" />

        </div>
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/main';


</style>