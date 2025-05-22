import { interpolate, addEdgePoints } from '@/composables/tools';

function calculateTriangle(canvas, pattern) {
    const chars = pattern.chars;
    const n = chars.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.4 * pattern.scale;

    // 三个顶点
    const V1 = { x: centerX, y: centerY - size }; // 顶部顶点
    const V2 = { x: centerX - size * 0.866, y: centerY + size * 0.5 }; // 左下
    const V3 = { x: centerX + size * 0.866, y: centerY + size * 0.5 }; // 右下

    const positions = [];

    if (n === 2) {
        const E1 = interpolate(V1, V2, 0.5);
        const E2 = interpolate(V1, V3, 0.5);
        return [E1, E2];
    }

    positions.push(V1, V2, V3);

    const remaining = n - 3;
    if (remaining > 0) {
        const edges = [
            { start: V1, end: V2 }, // 左边
            { start: V2, end: V3 }, // 底边
            { start: V1, end: V3 }  // 右边
        ];

        // 按优先级分配额外字符
        const perEdge = Math.floor(remaining / 3);
        const extra = remaining % 3;

        addEdgePoints(edges[1], perEdge + extra, positions);
        addEdgePoints(edges[0], perEdge, positions);
        addEdgePoints(edges[2], perEdge, positions);
    }

    return positions.slice(0, n);
}

function drawTriangle(canvas, pattern) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.4 * pattern.scale;

    // 固定三个顶点
    const V1 = { x: centerX, y: centerY - size };
    const V2 = { x: centerX - size * 0.866, y: centerY + size * 0.5 };
    const V3 = { x: centerX + size * 0.866, y: centerY + size * 0.5 };

    ctx.beginPath();
    ctx.moveTo(V1.x, V1.y);
    ctx.lineTo(V2.x, V2.y);
    ctx.lineTo(V3.x, V3.y);
    ctx.closePath();
    ctx.stroke();
}

export {
    calculateTriangle,
    drawTriangle
}