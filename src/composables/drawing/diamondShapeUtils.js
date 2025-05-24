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

    // 根据n值选择顶点
    if (n === 1) {
        positions.push(V1);
    } else if (n === 2) {
        positions.push(V2, V3);
    } else if (n === 3) {
        positions.push(V1, V2, V3);
    } else {
        // n >=4 的情况
        const includeV4 = (n - 4) % 2 === 0; // 先判断n-4是否为偶数
        positions.push(V1, V2, V3);
        if (includeV4) positions.push(V4);

        if (n > 4) {
            const remaining = includeV4 ? n - 4 : n - 3;
            const edges = [
                { start: V1, end: V2 }, // 上左边
                { start: V1, end: V3 }, // 上右边
                { start: V2, end: V4 }, // 下左边
                { start: V3, end: V4 }  // 下右边
            ];

            // 确保每条边分配的点数为偶数
            const perEdge = Math.floor(remaining / 4)
            const extra = remaining % 4;

            // 分配剩余点到各边
            if (extra > 0) {
                addEdgePoints(edges[0], perEdge + (extra > 0 ? 1 : 0), positions);
                addEdgePoints(edges[1], perEdge + (extra > 0 ? 1 : 0), positions);

                addEdgePoints(edges[2], perEdge, positions);
                addEdgePoints(edges[3], perEdge, positions);
            } else {
                edges.forEach(edge => addEdgePoints(edge, perEdge, positions));
            }
        }
    }

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