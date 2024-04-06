<script lang="ts" setup>
import { ListStore } from '@/store/todoList';
import { Check, Delete, Edit, Close, } from '@element-plus/icons-vue';

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
</script>

<template>
    <div class="container" v-if="documentReady">

        <el-button @click="saveLists" type="success" :icon="Check" circle />
        <el-popconfirm title="Are you sure to cancel editing?" @confirm="cancelEditingList">
            <template #reference>
                <el-button type="danger" :icon="Close" circle />
            </template>
        </el-popconfirm>

        <TodoDetails :docReady="documentReady" />
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/main';
</style>