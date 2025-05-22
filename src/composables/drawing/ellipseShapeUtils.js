
function calculateEllipse(canvas, pattern) {
    const n = pattern.chars.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radiusX = canvas.width * 0.4 * pattern.scale;
    const radiusY = canvas.height * 0.3 * pattern.scale;

    // 四个顶点（规则2.4.3）
    const V1 = { x: centerX, y: centerY - radiusY }; // 上
    const V3 = { x: centerX + radiusX, y: centerY };  // 右
    const V4 = { x: centerX, y: centerY + radiusY };  // 下
    const V2 = { x: centerX - radiusX, y: centerY };  // 左

    const positions = [];

    if (n <= 4) {
        positions.push(V1, V2, V3, V4);
    } else {
        positions.push(V1, V2, V3);

        const steps = Math.ceil(n / 4) * 4;
        console.log(`Ellipse with ${steps} steps`);
        const angleStep = (2 * Math.PI) / steps;
        const remaining = n - 4;

        //顺时针添加字符
        for (let i = 0; i < steps; i++) {
            if (i % (steps / 4) === 0) { //在顶点上
                continue;
            }
            if (
                (i + 1) % (steps / 4) === 0 //下一个是顶点
                &&
                Math.floor(i * 4 / steps) + 1 > remaining % 4 //如果所处的象限大于最终剩余字符数
                &&
                steps != n //排除满椭圆的情况
            ) {
                continue;
            }
            const angle = -1 * (i * angleStep);
            const x = centerX + radiusX * Math.cos(angle);
            const y = centerY + radiusY * Math.sin(angle);

            positions.push({ x, y });
        }

        positions.push(V4);
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