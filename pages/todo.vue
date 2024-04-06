<script lang="ts" setup>
import { ListStore } from '@/store/todoList';

const store = ListStore();

const router = useRouter();
const route = useRoute();

onMounted(() => {
    
})
</script>

<template>
    <div class="container">
        
        <TodoDetails />
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/main';
</style>