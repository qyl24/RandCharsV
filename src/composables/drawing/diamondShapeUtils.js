import { addEdgePoints } from '@/composables/tools';

function calculateDiamond(canvas, pattern) {
    const n = pattern.chars.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const width = canvas.width * 0.3 * 0.7 * pattern.scale;
    const height = canvas.height * 0.4 * pattern.scale;

    // 四个顶点
    const V1 = { x: centerX, y: centerY - height }; // 上
    const V2 = { x: centerX - width, y: centerY };  // 左
    const V3 = { x: centerX + width, y: centerY }; // 右
    const V4 = { x: centerX, y: centerY + height };  // 下

    const positions = [];
    positions.push(V1, V2, V3);

    if (n > 4) {
        const remaining = n - 4;
        const edges = [
            { start: V1, end: V2 }, // 上左边
            { start: V1, end: V3 }, // 上右边
            { start: V2, end: V4 }, // 下左边
            { start: V3, end: V4 }  // 下右边
        ];

        // 按优先级分配
        const perEdge = Math.floor(remaining / 4);
        const extra = remaining % 4;

        addEdgePoints(edges[0], perEdge + (extra > 0 ? 1 : 0), positions);
        addEdgePoints(edges[1], perEdge + (extra > 1 ? 1 : 0), positions);
        addEdgePoints(edges[2], perEdge + (extra > 2 ? 1 : 0), positions);
        addEdgePoints(edges[3], perEdge, positions);
    }

    positions.push(V4);
    return positions.slice(0, n);
}

function drawDiamond(canvas, pattern) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const width = canvas.width * 0.3 * 0.7 * pattern.scale; // 添加scale
    const height = canvas.height * 0.4 * pattern.scale;     // 添加scale

    // 固定四个顶点
    const points = [
        { x: centerX, y: centerY - height },       // 上
        { x: centerX + width, y: centerY },        // 右
        { x: centerX, y: centerY + height },       // 下
        { x: centerX - width, y: centerY }         // 左
    ];

    ctx.beginPath();
    points.forEach((p, i) =>
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)
    );
    ctx.closePath();
    ctx.stroke();
}

export {
    calculateDiamond,
    drawDiamond
}