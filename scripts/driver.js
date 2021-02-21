let Game = (function(graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();
    let canvasSize = document.getElementById('gameCanvas').width;
    let cellSize;
    let mazeSize;
    let maze;
    let link;
    let masterSword;

    function newMaze(size) {
        mazeSize = size;
        cellSize = canvasSize / mazeSize;
        maze = MazeGenerator.generateMaze(mazeSize);

        link = graphics.Texture({
            image: 'images/link.png',
            center: { x: cellSize / 2, y: cellSize / 2},
            width: cellSize,
            height: cellSize,
            positionX: 0,
            positionY: 0,
            moveRate: cellSize,
        });

        masterSword = graphics.Texture({
            image: 'images/masterSword.png',
            center: { x: canvasSize - (cellSize / 2), y: canvasSize - (cellSize / 2)},
            width: cellSize / 2.2,
            height: cellSize - 10,
            moveRate: 0,
        });
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {

    }

    function render() {
        graphics.clear();
        graphics.drawMaze(maze, mazeSize);
        link.draw();
        masterSword.draw();
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        processInput(elapsedTime);
        update(elapsedTime);
        render();
        if (link.getPositionX() === mazeSize - 1 && link.getPositionY() === mazeSize - 1) {
            document.getElementById("winMenu").style.display = "block";
            return;
        }
        requestAnimationFrame(gameLoop);
    }

    function startGame() {
        console.log('game initializing...');

        myKeyboard.registerCommand('a', link.moveLeft);
        myKeyboard.registerCommand('d', link.moveRight);
        myKeyboard.registerCommand('w', link.moveUp);
        myKeyboard.registerCommand('s', link.moveDown);

        myKeyboard.registerCommand('j', link.moveLeft);
        myKeyboard.registerCommand('l', link.moveRight);
        myKeyboard.registerCommand('i', link.moveUp);
        myKeyboard.registerCommand('k', link.moveDown);

        myKeyboard.registerResetCommand(link.resetMovement);

        requestAnimationFrame(gameLoop);
    }

    return {
        newMaze: newMaze,
        startGame: startGame,
    }
})(Graphics, Input);

function createMaze() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameCanvas").style.display = "inline";
    let mazeSize = document.getElementById("mazeSize-select").value;
    Game.newMaze(mazeSize);
    Game.startGame();
}

function backToMenu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("winMenu").style.display = "none";
    document.getElementById("gameCanvas").style.display = "none";
}
