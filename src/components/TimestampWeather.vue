<template>
  <div class="timestamp-weather">
    <div class="timestamp">{{ timestamp }}</div>
    <input class="weather" type="text" placeholder="晴" v-model="weather">
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useTimestampStore } from '@/stores/timestamp'

const timestampStore = useTimestampStore()
const timestamp = ref('')
const weather = ref('晴')

onMounted(() => {
  timestampStore.startAutoUpdate()
  timestamp.value = timestampStore.timestamp
})

watch(() => timestampStore.timestamp, (newVal) => {
  timestamp.value = newVal
})

onUnmounted(() => {
  timestampStore.stopAutoUpdate()
})
</script>

<style scoped>
.timestamp-weather {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 12px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
}

.weather {
  border: 0;
}

.weather:focus {
  outline: none;
  border-bottom: 1px solid #666;
}
</style>
