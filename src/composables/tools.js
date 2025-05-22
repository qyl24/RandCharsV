// 工具函数
function interpolate(start, end, ratio) {
    return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio
    };
}

function addEdgePoints(edge, count, positions) {
    for (let i = 1; i <= count; i++) {
        positions.push(interpolate(edge.start, edge.end, i / (count + 1)));
    }
}

function isNearVertex(x, y, vertices, threshold = 15) {
    return vertices.some(v =>
        Math.abs(v.x - x) < threshold &&
        Math.abs(v.y - y) < threshold
    );
}

export {
    interpolate,
    addEdgePoints,
    isNearVertex
}
