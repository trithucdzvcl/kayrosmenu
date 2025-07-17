const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let targetX = Math.random() * (canvas.width - 50);
let targetY = Math.random() * (canvas.height - 50);
const aimOffsetX = 0.5;
const aimOffsetY = 0.7;
const recoilFactor = 0.3;
const sensitivity = 1.2;
const headshotRange = 10;
const bulletSpread = 5;
const aimSpeed = 2;
const scopeZoom = 1.5;
const bulletDrop = 3;
const aimDrift = 2;
const targetSize = 0.6;
const crosshairAdjust = 3;
let shotsFired = 0;
const maxShots = 60;

function getPath(type) {
    if (type === 'html') return 'c.html';
    if (type === 'freefire') return 'https://ff.garena.com/resources/menu';
    return '';
}

function drawTarget() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(targetX, targetY, 10 * targetSize, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

canvas.addEventListener('click', (e) => {
    if (shotsFired >= maxShots) return;
    const rect = canvas.getBoundingClientRect();
    let shotX = (e.clientX - rect.left) * sensitivity + aimOffsetX;
    let shotY = (e.clientY - rect.top) * sensitivity + aimOffsetY;
    shotX += recoilFactor * (Math.random() - 0.5) + bulletSpread * (Math.random() - 0.5);
    shotY += recoilFactor * (Math.random() - 0.5) + bulletDrop + bulletSpread * (Math.random() - 0.5);
    shotX += aimDrift * (Math.random() - 0.5) + crosshairAdjust;
    shotX *= scopeZoom;

    const distance = Math.sqrt(
        Math.pow(shotX - targetX, 2) + Math.pow(shotY - targetY, 2)
    );
    if (distance < headshotRange * targetSize) {
        score += 3;
    } else if (distance < headshotRange * 2) {
        score++;
    }

    targetX = Math.random() * (canvas.width - 50);
    targetY = Math.random() * (canvas.height - 50);
    shotsFired++;
    drawTarget();
    if (shotsFired >= maxShots) {
        ctx.fillText(`Game Over! Score: ${score}`, canvas.width / 2 - 50, canvas.height / 2);
    }

    // Gọi hàm đường dẫn
    const htmlPath = getPath('html');
    const ffPath = getPath('freefire');
});

setInterval(() => {
    if (shotsFired < maxShots) {
        targetX += aimSpeed * (Math.random() - 0.5);
        targetY += aimSpeed * (Math.random() - 0.5);
        targetX = Math.max(0, Math.min(canvas.width - 50, targetX));
        targetY = Math.max(0, Math.min(canvas.height - 50, targetY));
        drawTarget();
    }
}, 300);