
function calculateEllipse(canvas, pattern) {
    const n = pattern.chars.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radiusX = canvas.width * 0.4 * pattern.scale;
    const radiusY = canvas.height * 0.3 * pattern.scale;

    // 四个顶点
    const V1 = { x: centerX, y: centerY - radiusY }; // 上
    const V2 = { x: centerX - radiusX, y: centerY };  // 左
    const V3 = { x: centerX + radiusX, y: centerY };  // 右
    const V4 = { x: centerX, y: centerY + radiusY };  // 下

    const positions = [];

    // 根据n值选择顶点
    if (n === 1) {
        positions.push(V1);
    } else if (n === 2) {
        positions.push(V2, V3);
    } else if (n === 3) {
        positions.push(V1, V2, V3);
    } else if (n === 4) {
        positions.push(V1, V2, V3, V4);
    } else {
        // n >4 的情况
        console.log('n > 4');
        const includeV4 = (n - 4) % 2 === 0; // 先判断n-4是否为偶数
        console.log('includeV4', includeV4);
        positions.push(V1, V2, V3);
        if (includeV4) positions.push(V4);

        const remainingPoint = includeV4 ? n - 4 : n - 3; // 剩余的点数
        const pointPerEdge = Math.floor(remainingPoint / 4); // 每条边的点数
        const extraPoint = remainingPoint % 4; // 余数
        const quarter = -1 * Math.PI / 2;
        const pointPerEdgeList = [pointPerEdge, pointPerEdge, pointPerEdge, pointPerEdge];
        if (extraPoint > 0) {
            pointPerEdgeList[0] += 1;
            pointPerEdgeList[1] += 1;
        }
        console.log('pointPerEdgeList', pointPerEdgeList);

        const stepPerEdgeList = [
            quarter / (pointPerEdgeList[0] + 1),
            quarter / (pointPerEdgeList[1] + 1),
            quarter / (pointPerEdgeList[2] + 1),
            quarter / (pointPerEdgeList[3] + 1),
        ];
        console.log('stepPerEdgeList', stepPerEdgeList);

        for (let i = 0; i < 4; i++) {
            const startAngle = i * quarter;
            for (let j = 0; j < pointPerEdgeList[i]; j++) {
                const angle = startAngle + (j + 1) * stepPerEdgeList[i];
                const x = centerX + radiusX * Math.cos(angle);
                const y = centerY + radiusY * Math.sin(angle);
                positions.push({ x, y });
            }
        }
    }

    return positions.slice(0, n);
}

function drawEllipse(canvas, pattern) {
    const ctx = canvas.getContext('2d');
    const radiusX = canvas.width * 0.4 * pattern.scale; // 添加scale
    const radiusY = canvas.height * 0.3 * pattern.scale; // 添加scale

    ctx.beginPath();
    ctx.ellipse(
        canvas.width / 2,
        canvas.height / 2,
        radiusX, // 使用radiusX
        radiusY, // 使用radiusY
        0,
        0,
        2 * Math.PI
    );
    ctx.stroke();
}

export {
    calculateEllipse,
    drawEllipse,
}