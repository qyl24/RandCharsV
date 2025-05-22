import { defineStore } from 'pinia';
import { ref, onUnmounted } from 'vue';

export const useTimestampStore = defineStore('timestamp', () => {
	const timestamp = ref('');
	let timer = null;

	// 自动更新方法
	function startAutoUpdate(interval = 1000) {
		const innerInterval = interval >= 100 ? interval : 100;
		if (!timer) {
			update();
			timer = setInterval(update, innerInterval);
		}
	}

	// 停止自动更新
	function stopAutoUpdate() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	// 手动更新
	function update() {
		timestamp.value = new Date().toLocaleString();
	}

	// 组件卸载时自动清理
	onUnmounted(stopAutoUpdate);

	return {
		timestamp,
		startAutoUpdate,
		stopAutoUpdate,
		update
	};
});
