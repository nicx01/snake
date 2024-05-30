document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', startGame);
document.getElementById('upButton').addEventListener('click', () => setDirection('UP'));
document.getElementById('downButton').addEventListener('click', () => setDirection('DOWN'));
document.getElementById('leftButton').addEventListener('click', () => setDirection('LEFT'));
document.getElementById('rightButton').addEventListener('click', () => setDirection('RIGHT'));

window.addEventListener('keydown', handleKeydown);
window.addEventListener('keyup', handleKeyup);

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 40;
const canvasSize = 800;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake;
let food;
let direction;
let gameLoop;
let score;

const appleImage = new Image();
appleImage.src = 'apple.png';

const headImage = new Image();
headImage.src = 'snake_head.png';

const bodyImage = new Image();
bodyImage.src = 'snake_body.png';

function startGame() {
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameOverMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('score').innerText = '0';

    snake = [{ x: 200, y: 200 }];
    food = { x: getRandomInt(0, canvasSize / gridSize) * gridSize, y: getRandomInt(0, canvasSize / gridSize) * gridSize };
    direction = 'RIGHT';
    score = 0;

    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameTick, 100);
}

function gameTick() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y -= gridSize;
            break;
        case 'DOWN':
            head.y += gridSize;
            break;
        case 'LEFT':
            head.x -= gridSize;
            break;
        case 'RIGHT':
            head.x += gridSize;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        food = { x: getRandomInt(0, canvasSize / gridSize) * gridSize, y: getRandomInt(0, canvasSize / gridSize) * gridSize };
    } else {
        snake.pop();
    }

    if (checkCollision()) {
        gameOver();
        return;
    }

    drawGame();
}

function handleKeydown(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            setDirection('UP');
            document.getElementById('upButton').classList.add('pressed');
            break;
        case 'ArrowDown':
        case 's':
            setDirection('DOWN');
            document.getElementById('downButton').classList.add('pressed');
            break;
        case 'ArrowLeft':
        case 'a':
            setDirection('LEFT');
            document.getElementById('leftButton').classList.add('pressed');
            break;
        case 'ArrowRight':
        case 'd':
            setDirection('RIGHT');
            document.getElementById('rightButton').classList.add('pressed');
            break;
    }
}

function handleKeyup(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            document.getElementById('upButton').classList.remove('pressed');
            break;
        case 'ArrowDown':
        case 's':
            document.getElementById('downButton').classList.remove('pressed');
            break;
        case 'ArrowLeft':
        case 'a':
            document.getElementById('leftButton').classList.remove('pressed');
            break;
        case 'ArrowRight':
        case 'd':
            document.getElementById('rightButton').classList.remove('pressed');
            break;
    }
}

function setDirection(newDirection) {
    const oppositeDirections = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT'
    };

    if (oppositeDirections[direction] !== newDirection) {
        direction = newDirection;
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    snake.forEach((part, index) => {
        if (index === 0) {
            drawRotatedImage(ctx, headImage, part.x, part.y, gridSize, gridSize, direction);
        } else {
            ctx.drawImage(bodyImage, part.x, part.y, gridSize, gridSize);
        }
    });

    ctx.drawImage(appleImage, food.x, food.y, gridSize, gridSize);
}

function drawRotatedImage(ctx, image, x, y, width, height, direction) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    switch (direction) {
        case 'UP':
            ctx.rotate(-Math.PI / 2);
            break;
        case 'DOWN':
            ctx.rotate(Math.PI / 2);
            break;
        case 'LEFT':
            ctx.rotate(Math.PI);
            break;
        case 'RIGHT':
            ctx.rotate(0);
            break;
    }
    ctx.drawImage(image, -width / 2, -height / 2, width, height);
    ctx.restore();
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }

    return false;
}

function gameOver() {
    clearInterval(gameLoop);
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOverMenu').style.display = 'block';
    document.getElementById('finalScore').innerText = score;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
