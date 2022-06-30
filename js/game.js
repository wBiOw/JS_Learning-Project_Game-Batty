let canvas = document.getElementById("gameCanvas");
canvas.width = 480;
canvas.height = 320;
let sprite = canvas.getContext("2d");
//Ball
let xBall = 25;
let yBall = 306;
let ballRadius = 4;
let xStepBall = 3;
let yStepBall = -3;
//Platform
let widthPlatform = 50;
let hightPlatform = 8;
let xPlatform = widthPlatform / 2;
let switchMovePlatform = 0; //-1, 0 ,1
let xStepMovePlatform = 10;
// Bricks
let widthBricks = 40;
let hightBricks = 10;
let arrayXYStatBricks = [];
let sumBricks = fillXYStatBricks(arrayXYStatBricks, widthBricks, hightBricks, canvas.width);

let score = 0;

go()

document.addEventListener("mousemove", mouseMovePlatform);
document.addEventListener("keydown", keyDownMovePlatform);
document.addEventListener("keyup", keyUpMovePlatform);
document.querySelector("#yesNewGameBtn").onclick = newGame;
document.querySelector("#noNewGameBtn").onclick = function () {
    close();
}

function fillXYStatBricks(array, widthOne, hightOne, widthMax, row) {
    if (row === undefined) row = "5";
    row = parseInt(row);
    let col = Math.floor(widthMax / (widthOne + 15));
    let gap = (widthMax - col * widthOne) / (col + 1);
    let yItem = gap + hightOne;
    let sum = 0;
    for (let y = 0; y < row; y++) {
        let xItem = gap;
        for (let x = 0; x < col; x++) {
            if (array[sum] === undefined) array.push({ y: yItem, x: xItem, status: true });
            sum++;
            xItem += gap + widthOne;
        }
        yItem += gap + hightOne
    }
    return sum;
}

function go() {
    sprite.clearRect(0, 0, canvas.width, canvas.height);
    xPlatform = xPlatform + switchMovePlatform * xStepMovePlatform;
    if (xPlatform + widthPlatform > canvas.width) xPlatform = canvas.width - widthPlatform;
    if (xPlatform < 0) xPlatform = 0;
    spritePlatform(xPlatform, canvas.height - hightPlatform - 2, widthPlatform, hightPlatform);
    interactionBall()
    xBall += xStepBall;
    yBall += yStepBall;
    spriteBall(xBall, yBall, ballRadius);
    for (let index = 0; index < arrayXYStatBricks.length; index++) {
        if (arrayXYStatBricks[index].status === true) {
            spriteBrick(arrayXYStatBricks[index].x, arrayXYStatBricks[index].y, widthBricks, hightBricks);
        }
    }
    hitBallBrick(xBall, yBall, arrayXYStatBricks, widthBricks, hightBricks);
    wrtScore();
    requestAnimationFrame(go);
}

function spritePlatform(x, y, width, hight, color) {
    if (color === undefined) color = "blue";
    sprite.beginPath();
    sprite.rect(x, y, width, hight);
    sprite.fillStyle = color;
    sprite.fill();
    sprite.closePath();
}

function interactionBall() {
    //interaction ball with walls
    if (xBall + xStepBall + ballRadius > canvas.width ||
        xBall + xStepBall - ballRadius / 2 < 0) {
        xStepBall = -xStepBall;
    }
    if (yBall + yStepBall - ballRadius < 0) {
        yStepBall = -yStepBall;
    }
    if (yBall + yStepBall> canvas.height &&
        score < sumBricks) {   
        gameOver();
        return;
     }
    //interaction ball with Platform
    if (yBall + yStepBall + ballRadius > canvas.height - hightPlatform - 2 &&
        xBall < xPlatform + widthPlatform &&
        xBall + xStepMovePlatform > xPlatform) {
        yStepBall = -yStepBall;
    }
}

function spriteBall(x, y, radius, color) {
    if (color === undefined) color = "orange";
    sprite.beginPath();
    sprite.arc(x, y, radius, 0, Math.PI * 2);
    sprite.fillStyle = color;
    sprite.fill();
    sprite.closePath();
}

function spriteBrick(x, y, width, hight, color) {
    if (color === undefined) color = "green";
    sprite.beginPath();
    sprite.rect(x, y, width, hight);
    sprite.fillStyle = color;
    sprite.fill();
    sprite.closePath();
}

function hitBallBrick(x, y, arrayXYStat, width, hight) {
    for (let index = 0; index < arrayXYStat.length; index++) {
        if (arrayXYStat[index].x < x + ballRadius &&
            arrayXYStat[index].x + width > x - ballRadius &&
            arrayXYStat[index].y < y + ballRadius &&
            arrayXYStat[index].y + hight > y - ballRadius &&
            arrayXYStatBricks[index].status === true) {
            if ((x < arrayXYStat[index].x & xStepBall > 0) ||
                (x > arrayXYStat[index].x + width & xStepBall < 0)) {
                xStepBall = -xStepBall;
            } else {
                if ((y > arrayXYStat[index].y + hight && yStepBall < 0) ||
                    (y < arrayXYStat[index].y && yStepBall > 0)) {
                    yStepBall = -yStepBall;
                }
            }
            arrayXYStatBricks[index].status = false;
            score++;
            if (score === arrayXYStat.length) {
                gameWin();
                return;
            }
        }
    }
}

function gameOver() {
    let wrtMessage = document.getElementById("message");
    wrtMessage.style.display = "inherit";
    let wrtGameOver = document.getElementById("gameOver");
    wrtGameOver.style.display = "inherit";
}

function gameWin() {
    let wrtMessage = document.getElementById("message");
    wrtMessage.style.display = "inherit";
    let wrtGameWin = document.getElementById("gameWin");
    wrtGameWin.style.display = "inherit";
}

function wrtScore() {
    sprite.font = "12px Arial";
    sprite.fillStyle = "black";
    sprite.fillText("Score: " + score, 10, 20);
}

function mouseMovePlatform(e) {
    const pageWidth = document.documentElement.scrollWidth;
    let realCanvasWidth = 0.6 * pageWidth; //correct extension Canvas
    let mouseX = e.clientX - 0.2 * pageWidth;
    xPlatform = mouseX / realCanvasWidth * canvas.width - widthPlatform / 2;
}

function keyDownMovePlatform(key) {
    if (key.keyCode == 39) {
        switchMovePlatform = 1;
    }
    else if (key.keyCode == 37) {
        switchMovePlatform = -1;
    }
}

function keyUpMovePlatform(key) {
    if (key.keyCode == 39) {
        switchMovePlatform = 0;
    }
    else if (key.keyCode == 37) {
        switchMovePlatform = 0;
    }
}

function newGame() {
    document.location.reload();
    clearInterval(game);
}