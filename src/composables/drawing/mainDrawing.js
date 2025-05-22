import { calculateTriangle, drawTriangle } from '@/composables/drawing/triangleShapeUtils';
import { calculateRectangle, drawRectangle, } from '@/composables/drawing/rectangleShapeUtils';
import { calculateEllipse, drawEllipse } from '@/composables/drawing/ellipseShapeUtils';
import { calculateDiamond, drawDiamond } from '@/composables/drawing/diamondShapeUtils';

function calculatePositions(canvas, pattern) {
    switch (pattern.shape) {
        case 'triangle': return calculateTriangle(canvas, pattern);
        case 'diamond': return calculateDiamond(canvas, pattern);
        case 'rectangle': return calculateRectangle(canvas, pattern);
        case 'ellipse': return calculateEllipse(canvas, pattern);
        default: return [];
    }
}

function drawShape(canvas, pattern) {
    switch (pattern.shape) {
        case 'triangle':
            drawTriangle(canvas, pattern);
            break;
        case 'diamond':
            drawDiamond(canvas, pattern);
            break;
        case 'rectangle':
            drawRectangle(canvas, pattern);
            break;
        case 'ellipse':
            drawEllipse(canvas, pattern);
            break;
        default:
            break;
    }
}

function drawChars(canvas, pattern) {
    const ctx = canvas.getContext('2d');
    const defaultSize = 20;

    pattern.chars.forEach((char, index) => {
        const pos = pattern.positions[index];
        if (!pos) return;

        const fontSize = pattern.fontSizes?.[index] || defaultSize;
        ctx.fillStyle = pattern.colors[index] || 'black';
        ctx.font = `${fontSize}px ${pattern.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char, pos.x, pos.y);
    });
}


function draw(canvas, pattern) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#111111';
    switch (pattern.lineStyle) {
        case 'solid':
            ctx.setLineDash([]);
            break;
        case 'dashed1':
            ctx.setLineDash([5, 5]);
            break;
        case 'dashed2':
            ctx.setLineDash([10, 10]);
            break;
        default:
            ctx.setLineDash([]); // 默认 solid
            break;
    }

    // 计算字符位置，更新pattern.positions
    const currentPositions = calculatePositions(canvas, pattern);
    pattern.positions.splice(0, pattern.positions.length);
    pattern.positions.push(...currentPositions);

    let isLengthChanged = false;

    //修减或补足colors和fontSizes
    if (pattern.colors.length < pattern.chars.length) {
        isLengthChanged = true;
        pattern.colors.push(...(new Array(pattern.chars.length - pattern.colors.length).fill('black')));
    } else if (pattern.colors.length > pattern.chars.length) {
        isLengthChanged = true;
        pattern.colors.splice(pattern.chars.length, pattern.colors.length - pattern.chars.length);
    }
    if (pattern.fontSizes.length < pattern.chars.length) {
        isLengthChanged = true;
        pattern.fontSizes.push(...(new Array(pattern.chars.length - pattern.fontSizes.length).fill(20)));
    } else if (pattern.fontSizes.length > pattern.chars.length) {
        isLengthChanged = true;
        pattern.fontSizes.splice(pattern.chars.length, pattern.fontSizes.length - pattern.chars.length);
    }

    //打乱字符
    if (isLengthChanged) {
        const newChars = [];
        pattern.chars.forEach((char) => {
            newChars.push(char);
        });
        newChars.sort(() => Math.random() - 0.5);
        pattern.chars.splice(0, pattern.chars.length);
        pattern.chars.push(...newChars);
    }

    // 绘制形状
    drawShape(canvas, pattern);

    // 绘制字符
    drawChars(canvas, pattern);
}

function initCanvasSize(canvas, pattern) {
    canvas.width = 750;
    canvas.height = 750;
    draw(canvas, pattern);
}

export {
    draw,
    initCanvasSize
};
