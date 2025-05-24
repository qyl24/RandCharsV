import { addEdgePoints } from '@/composables/tools';

function calculateRectangle(canvas, pattern) {
    const n = pattern.chars.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const width = canvas.width * 0.4 * pattern.scale;
    const height = canvas.height * 0.3 * pattern.scale;

    // 四个顶点
    const V1 = { x: centerX - width, y: centerY - height }; // 左上
    const V2 = { x: centerX + width, y: centerY - height }; // 右上
    const V3 = { x: centerX - width, y: centerY + height }; // 左下
    const V4 = { x: centerX + width, y: centerY + height }; // 右下

    const positions = [];

    // 根据n值选择顶点
    if (n === 1) {
        positions.push({ x: (V1.x + V2.x) / 2, y: (V1.y + V2.y) / 2 });
    } else if (n === 2) {
        positions.push(V1, V2);
    } else if (n === 3) {
        positions.push(V1, V2, { x: (V3.x + V4.x) / 2, y: (V3.y + V4.y) / 2 }); // 中间点
    } else if (n === 4) {
        positions.push(V1, V2, V3, V4);
    } else {
        // n >4 的情况
        positions.push(V1, V2, V3, V4);
        const remaining = n - 4
        const edges = [
            { start: V1, end: V2 }, // 上边
            { start: V1, end: V3 }, // 左边
            { start: V2, end: V4 }, // 右边
            { start: V3, end: V4 }  // 下边
        ];

        const perEdge = Math.floor(remaining / 4)
        const extra = remaining % 4;
        const perEdgeList = [perEdge, perEdge, perEdge, perEdge];
        if (extra === 1) {
            perEdgeList[0] += 1; // 上边多一个点
        } else if (extra === 2) {
            perEdgeList[0] += 1; // 上边多一个点
            perEdgeList[3] += 1; // 下边多一个点
        } else if (extra === 3) {
            perEdgeList[0] += 1; // 上边多一个点
            perEdgeList[1] += 1; // 左边多一个点
            perEdgeList[2] += 1; // 右边多一个点
        }

        edges.forEach((edge, i) => {
            addEdgePoints(edge, perEdgeList[i], positions);
        });
    }

    return positions;
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
