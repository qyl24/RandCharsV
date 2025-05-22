<template>
  <div class="main-container">
    <NavigationPanel @refresh="handleRefresh" />

    <div class="content-container">
      <InputContainer v-model="inputText" />

      <div class="canvas-container">

        <div class="inner-menu">
          <Toolbar @refresh="handleRefresh" @copy="captureImage" />
          <select class="select" v-model="selectedShape">
            <option v-for="item in configStore.shapeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>

          <select class="select" v-model="selectedFont">
            <option v-for="item in configStore.fontList" :key="item.value" :value="item.value">
              {{ item.name }}
            </option>
          </select>

          <select class="select" v-model="selectedLineStyle">
            <option v-for="item in configStore.lineStyleOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>

          <select class="select" v-model="selectedScale">
            <option v-for="item in configStore.scaleOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>

        <div class="capture" ref="capture">
          <canvas class="canvas" ref="mainCanvas" @click="handleClickOnCanvas" @resize="initCanvasSize"></canvas>
          <TimestampWeather />
        </div>

      </div>

      <button @click="captureImage">生成图片</button>

    </div>
  </div>
</template>

<script setup>
console.log('setup');

import { onMounted, ref, watch } from 'vue';

import NavigationPanel from './components/NavigationPanel.vue';
import TimestampWeather from '@/components/TimestampWeather.vue';
import InputContainer from '@/components/InputContainer.vue';
import Toolbar from '@/components/ToolbarOfR.vue';

import html2canvas from 'html2canvas';

import { useConfigStore } from '@/stores/config'
import { draw, initCanvasSize } from '@/composables/drawing/mainDrawing'
import { useCanvasInteraction } from '@/composables/useCanvasInteraction';
import { usePatternStore } from '@/stores/patternStore';
const patternStore = usePatternStore();
const workspacePattern = patternStore.workspacePattern;


const configStore = useConfigStore();

const inputText = ref('');
const selectedShape = ref('diamond');
const selectedFont = ref('微软雅黑');
const selectedLineStyle = ref('solid');
const selectedScale = ref('0.5');

const capture = ref(null);
const mainCanvas = ref(null);

const adjustmentScale = 1.6;

const { handleClickOnCanvas } = useCanvasInteraction(mainCanvas, workspacePattern);

const handleRefresh = () => {
  // 触发重新绘制
  console.log('handleRefresh');
  draw(mainCanvas.value, workspacePattern);
};

watch([inputText, selectedShape, selectedFont, selectedLineStyle, selectedScale], () => {
  console.log('watch 1')

  const defaultText = "水里有很多小鱼".split('');
  workspacePattern.chars = inputText.value ? [...inputText.value] : [...defaultText];
  workspacePattern.shape = selectedShape.value;
  workspacePattern.fontFamily = selectedFont.value;
  workspacePattern.lineStyle = selectedLineStyle.value;
  workspacePattern.scale = parseFloat(selectedScale.value) * adjustmentScale;

  if (mainCanvas.value) {
    console.log('watch 1-2')

    draw(mainCanvas.value, workspacePattern);
  }
});

onMounted(() => {
  console.log('onMounted');

  if (mainCanvas.value) {
    console.log('onMounted-2')
    initCanvasSize(mainCanvas.value, workspacePattern);
  }
})

async function captureImage() {
  console.log("captureImage")
  try {
    // 更新当前时间戳
    //updateTimestamp();

    // 使用 html2canvas 截图
    const canvas = await html2canvas(capture.value);

    // 将 canvas 转为 blob
    canvas.toBlob(async (blob) => {
      try {
        // 复制到剪贴板
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        alert('截图已复制到剪贴板！');
      } catch (err) {
        console.error('复制失败:', err);
      }
    });
  } catch (err) {
    console.error('截图失败:', err);
  }
}

</script>

<style scoped>
.main-container {
  display: flex;
  /* height: 100vh; */
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  overflow: auto;
}

.input-text {
  width: 750px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.canvas-container {
  width: 750px;
  aspect-ratio: 1/1;
  position: relative;
  border: 1px dashed #888;
  display: grid;
  place-items: center;
  /* 淡墨色虚线边框 */
}

.inner-menu {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.select {
  padding: 4px;
  font-size: 12px;
  min-width: 100px;
}

.capture {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.canvas {
  /* width: 100%;
  height: 100%; */
  width: 100%;
  height: 100%;
}

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

button {
  padding: 8px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  /* transition: background 0.3s; */
}

button:hover {
  background: #79bbff;
}

.input-container {
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
}
</style>
