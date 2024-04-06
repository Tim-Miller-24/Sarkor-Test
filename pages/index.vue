<script lang="ts" setup>

const router = useRouter();

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