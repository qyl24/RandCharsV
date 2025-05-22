
import { isNearVertex } from './tools';
import { draw } from './drawing/mainDrawing';

export function useCanvasInteraction(canvasRef, pattern) {
	let lastClickTime = 0;

	const handleClickOnCanvas = (e) => {
		const now = Date.now();
		const isDoubleClick = (now - lastClickTime) < 300; // 300ms内视为双击
		lastClickTime = now;

		if (!canvasRef.value) return;

		const canvas = canvasRef.value;
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const x = (e.clientX - rect.left) * scaleX;
		const y = (e.clientY - rect.top) * scaleY;

		// 检测点击的字符
		pattern.chars.forEach((_, i) => {
			const pos = pattern.positions[i];
			if (isNearVertex(x, y, [pos])) {
				if (isDoubleClick) {
					// 双击逻辑：切换字体大小
					const defaultSize = 20;
					if (!pattern.fontSizes[i] || pattern.fontSizes[i] === defaultSize) {
						pattern.fontSizes[i] = defaultSize * 1.8;
					} else {
						pattern.fontSizes[i] = defaultSize;
					}
				} else {
					// 原有单击变色逻辑
					pattern.colors[i] = pattern.colors[i] === 'black' ? 'red' : 'black';
				}
				draw(canvasRef.value, pattern);
			}
		});
	}

	return { handleClickOnCanvas };
}
