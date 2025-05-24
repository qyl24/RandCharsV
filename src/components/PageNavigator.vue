<template>
  <div class="page-navigator">
    <button class="nav-btn" @click="handleLastPage" title="上一页">◀</button>
    <span class="page-info">{{ currentIndexDisplay }}/{{ totalPage }}</span>
    <button class="nav-btn" @click="handleNextPage" title="下一页">▶</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePatternStore } from '@/stores/patternStore';

const emit = defineEmits(['refresh'])

const patternStore = usePatternStore();

const currentIndexDisplay = computed(() => {
  return patternStore.currIndex.value === patternStore.WORKSPACE_IDX
    ? 'W'
    : patternStore.currIndex.value + 1
})

const totalPage = computed(() => patternStore.totalPage.value)

const handleLastPage = () => {
  patternStore.lastPage()
  emit('refresh')
};

const handleNextPage = () => {
  patternStore.nextPage()
  emit('refresh')
};
</script>

<style scoped>
.page-navigator {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.nav-btn {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.nav-btn:hover {
  background: #f0f0f0;
}

.page-info {
  padding: 0 8px;
  font-size: 12px;
}
</style>
