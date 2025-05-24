<template>
  <div class="toolbar">
    <button class="tool-btn" @click="handleNew" title="新建">➕</button>
    <button class="tool-btn" @click="handleSave" title="保存">💾</button>
    <button class="tool-btn" @click="handleRefresh" title="刷新">🔄</button>
    <button class="tool-btn" @click="handleCopy" title="复制">CP</button>
  </div>
</template>

<script setup>
import { usePatternStore } from '@/stores/patternStore';

const emit = defineEmits(['refresh', 'copy']);

const patternStore = usePatternStore();

const handleNew = () => {
  console.log('handleNew');

  patternStore.newPattern()
  emit('refresh');
};

const handleSave = () => {
  console.log('handleSave');

  if (patternStore.savePattern()) {
    alert('保存成功！');
  } else {
    alert('内容已存在，无需重复保存');
  }
};

const handleRefresh = () => {
  // 刷新功能由父组件处理
  console.log('emit handleRefresh');
  emit('refresh');
};

const handleCopy = () => {
  // 复制功能由父组件处理
  console.log('emit handleCopy');
  emit('copy');
};
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 5px;
}

.tool-btn {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.tool-btn:hover {
  background: #f0f0f0;
}
</style>
