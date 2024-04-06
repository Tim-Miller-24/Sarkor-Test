<script lang="ts" setup>

const router = useRouter();

function createList() {
    router.push('/todo?creating=newList');
}

</script>

<template>
    <div class="container main">
        <el-button class="createList-btn" @click="createList" type="primary" plain>Create ToDo List</el-button>
        
        <TodoList />
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/main';

</style>