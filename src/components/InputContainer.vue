<template>
  <div class="input-container">
    <!-- <input class="input-text" placeholder="请输入一句话，如：水里有很多小鱼" v-model="inputText"
      :type="showInput ? 'text' : 'password'">
    <button class="toggle-btn" @click="toggleInputDisplay">
      {{ showInput ? '隐藏' : '显示' }}
    </button> -->
  </div>
</template>

<script setup>
// import { ref, computed } from 'vue';

// const props = defineProps({
//   modelValue: {
//     type: String,
//     required: true
//   }
// });

// const emit = defineEmits(['update:modelValue']);

// const showInput = ref(true);

// const inputText = computed({
//   get: () => props.modelValue,
//   set: (value) => emit('update:modelValue', value)
// });

// const toggleInputDisplay = () => {
//   showInput.value = !showInput.value;
// };
</script>

<style scoped>
/* .input-container {
  position: relative;
  display: flex;
  width: 750px;
}

.input-text {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.toggle-btn {
  margin-left: 8px;
  padding: 0 12px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-btn:hover {
  background: #79bbff;
} */
</style>
