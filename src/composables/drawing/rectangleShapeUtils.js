import { addEdgePoints } from '@/composables/tools';

function calculateRectangle(canvas, pattern) {
    const chars = pattern.chars;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const positions = [];
    const n = chars.length;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const width = canvasWidth * 0.4 * pattern.scale;
    const height = canvasHeight * 0.3 * pattern.scale;

    // 四个边角
    const points = [
        { x: centerX - width, y: centerY - height }, // 左上
        { x: centerX + width, y: centerY - height }, // 右上
        { x: centerX - width, y: centerY + height },  // 左下
        { x: centerX + width, y: centerY + height } // 右下

    ];

    positions.push(...points.slice(0, Math.min(n, 4)));

    // 边线补充点
    if (n > 4) {
        const remaining = n - 4;
        const edges = [
            { start: points[0], end: points[1] }, // 上边
            { start: points[0], end: points[2] }, // 左边
            { start: points[1], end: points[3] }, // 右边
            { start: points[2], end: points[3] }  // 下边
        ];

        edges.forEach(edge => {
            const edgePoints = Math.ceil(remaining / 4);
            addEdgePoints(edge, edgePoints, positions);
        });
    }

    return positions.slice(0, n);
}

function drawRectangle(canvas, pattern) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const width = canvas.width * 0.4 * pattern.scale;  // 添加scale
    const height = canvas.height * 0.3 * pattern.scale; // 添加scale

    // 固定四个顶点
    const points = [
        { x: centerX - width, y: centerY - height }, // 左上
        { x: centerX + width, y: centerY - height }, // 右上
        { x: centerX + width, y: centerY + height }, // 右下
        { x: centerX - width, y: centerY + height }  // 左下
    ];

    ctx.beginPath();
    points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    );
    ctx.closePath();
    ctx.stroke();
}

export {
    calculateRectangle,
    drawRectangle
};
