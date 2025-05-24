<template>
  <div class="navigation-panel">
    <div v-for="date in dateList" :key="date" class="date-item" :class="{ active: selectedDate === date }"
      @click="selectDate(date)">
      {{ date }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePatternStore } from '@/stores/patternStore';

const emit = defineEmits(['refresh']);

const patternStore = usePatternStore();
const dateList = ref([]);
const selectedDate = ref('');

// 更新日期列表
function updateDateList() {
  dateList.value = patternStore.getDateList();
}

// 初始化
updateDateList();

// 监听store中的日期变化
watch(() => patternStore.selectedDate.value, () => {
  updateDateList();
});

// 选择日期
function selectDate(date) {
  console.log('select date:', date);
  selectedDate.value = date;
  patternStore.switchDate(date);
  emit('refresh');
}
</script>

<style scoped>
.navigation-panel {
  width: 100px;
  height: 100%;
  border-right: 1px solid #ccc;
  overflow-y: auto;
}

.date-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.date-item:hover {
  background-color: #f5f5f5;
}

.date-item.active {
  background-color: #e0f0ff;
  font-weight: bold;
}
</style>
