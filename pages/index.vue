<script lang="ts" setup>
import { ListStore } from '@/store/todoList';

const router = useRouter();
const route = useRoute();

const store = ListStore();

function createList() {
    router.push('/todo?creating=newList');
}

</script>

<template>
    <div class="container">
        <TodoList />
        <button @click="createList">create todo list</button>
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/main';
</style>