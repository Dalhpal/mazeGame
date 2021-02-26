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
    let rupee;
    let rupeeReady;
    let heart;
    let heartReady;
    let solution;
    let scoreSolution;
    let showSolution = false;
    let showHint = false;
    let visited = [];
    let showVisited = false;
    let totalTime = 0;
    let timeOffset = 0;
    let score = 5;

    function newMaze(size) {
        mazeSize = size;
        cellSize = canvasSize / mazeSize;
        maze = MazeGenerator.generateMaze(mazeSize);
        solution = MazeGenerator.solveMaze();
        scoreSolution = MazeGenerator.solveMaze();
        scoreSolution.shift();

        link = graphics.Texture({
            image: 'images/link.png',
            center: { x: cellSize / 2, y: cellSize / 2},
            width: cellSize,
            height: cellSize,
            positionX: 0,
            positionY: 0,
            lastPositionX: 0,
            lastPositionY: 0,
            moveRate: cellSize,
        });

        masterSword = graphics.Texture({
            image: 'images/masterSword.png',
            center: { x: canvasSize - (cellSize / 2), y: canvasSize - (cellSize / 2)},
            width: cellSize / 2.2,
            height: cellSize - 10,
            moveRate: 0,
        });

        let rupeeImg = new Image();
        rupeeImg.src = 'images/rupee.png';
        rupeeImg.onload = function() {
            rupeeReady = true;
        };

        rupee = {
            image: rupeeImg,
            width: cellSize / 3.5,
            height: cellSize / 2,
            centerOffsetY: 0,
            centerOffsetX: -1 * (cellSize / 10),
        };

        let heartImg = new Image();
        heartImg.src = 'images/heart.png';
        heartImg.onload = function() {
            heartReady = true;
        };

        heart = {
            image: heartImg,
            width: cellSize / 2,
            height: cellSize * .75,
            centerOffsetY: cellSize / 6,
            centerOffsetX: -1 * (cellSize / 100),
        };
    }

    function toggleSolution() {
        showHint = false;
        showSolution = !showSolution;
    }

    function toggleHint() {
        showSolution = false;
        showHint = !showHint;
    }

    function toggleVisited() {
        showVisited = !showVisited;
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        totalTime += elapsedTime;
        _updateVisited();
        _updateSolution();
        _updateScoreSolution();
    }

    function _updateVisited() {
        let addToVisited = true;
        for (let i = 0; i < visited.length; i++) {
            if (link.getPositionX() === visited[i].x && link.getPositionY() === visited[i].y) {
                addToVisited = false;
            }
        }
        if (addToVisited) {
            visited.push({x: link.getPositionX(), y: link.getPositionY()});
        }
    }

    function _updateSolution() {
        if (solution.length > 1) {
            let addToSolution = true;
            for (let i = 0; i < solution.length; i++) {
                if (link.getPositionX() === solution[i].x && link.getPositionY() === solution[i].y) {
                    addToSolution = false;
                }
            }
            if (addToSolution) {
                solution.unshift({x: link.getPositionX(), y: link.getPositionY()});
            }
            if (link.getLastPositionX() === solution[0].x && link.getLastPositionY() === solution[0].y && (link.getPositionX() === solution[1].x && link.getPositionY() === solution[1].y)) {
                solution.shift();
            }
        } else {
            solution = [];
        }
    }

    function _updateScoreSolution() {
        if (scoreSolution.length > 0) {
            if (link.getPositionX() === scoreSolution[0].x && link.getPositionY() === scoreSolution[0].y) {
                scoreSolution.shift();
                if (showSolution || showHint) {
                    score += 2;
                } else if (showVisited) {
                    score += 4;
                } else {
                    score += 5;
                }
            } else {
                score -= (1 / 30);
            }
        } else {
            score -= (1 / 30);
        }
    }

    function render() {
        _updateTime();
        _updateScore();
        graphics.clear();
        graphics.drawMaze(maze, mazeSize);
        if (rupeeReady && showVisited) {
            graphics.drawPath(visited, rupee, cellSize);
        }
        if (heartReady && showSolution) {
            graphics.drawPath(solution, heart, cellSize);
        } else if (heartReady && showHint && solution.length > 1) {
            graphics.drawPath([solution[1]], heart, cellSize);
        }
        link.draw();
        masterSword.draw();
    }

    function _updateTime() {
        let timeString = _millisToMinutesAndSeconds(totalTime - timeOffset);
        document.getElementById('totalTime').innerHTML = timeString;
    }

    function _millisToMinutesAndSeconds(millis) {
        if (millis < 0) {
            return '0:00';
        }
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    function _updateScore() {
        document.getElementById('score').innerHTML = Math.ceil(score);
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        processInput(elapsedTime);
        update(elapsedTime);
        render();
        if (link.getPositionX() === mazeSize - 1 && link.getPositionY() === mazeSize - 1) {
            _endGame();
            return;
        }
        requestAnimationFrame(gameLoop);
    }

    function _endGame() {
        visited = [];
        showVisited = false;
        showSolution = false;
        showHint = false;
        _updateHighScoresMenu();
        score = 0;
        document.getElementById("winMenu").style.display = "block";
    }

    function _updateHighScoresMenu() {
        highScores[mazeSize].push(Math.ceil(score));
        highScores[mazeSize].sort();
        highScores[mazeSize].reverse();
        let highScoresHTML = `<div style="margin-bottom: 2px;">${mazeSize}x${mazeSize}</div>`;
        for (let i = 0; i < highScores[mazeSize].length; i++) {
            highScoresHTML += `<div class="light">${highScores[mazeSize][i]}</div>`;
        }
        document.getElementById(mazeSize).innerHTML = highScoresHTML;
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

        myKeyboard.registerCommand('ArrowLeft', link.moveLeft);
        myKeyboard.registerCommand('ArrowRight', link.moveRight);
        myKeyboard.registerCommand('ArrowUp', link.moveUp);
        myKeyboard.registerCommand('ArrowDown', link.moveDown);

        myKeyboard.registerResetCommand(link.resetMovement);

        timeOffset = performance.now();

        requestAnimationFrame(gameLoop);
    }

    return {
        newMaze: newMaze,
        startGame: startGame,
        toggleSolution: toggleSolution,
        toggleHint: toggleHint,
        toggleVisited: toggleVisited,
    }
})(Graphics, Input);

let highScores = {
    5: [],
    10: [],
    15: [],
    20: [],
};

function createMaze() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    let mazeSize = document.getElementById("mazeSize-select").value;
    Game.newMaze(mazeSize);
    Game.startGame();
}

function backToMenu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("winMenu").style.display = "none";
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("highScores").style.display = "none";
    document.getElementById("credits").style.display = "none";
}

function viewHighScores() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("highScores").style.display = "block";
}

function viewCredits() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("credits").style.display = "block";
}

window.addEventListener('keyup', function(e) {
    if (e.key === 'p') {
        Game.toggleSolution();
    }
    if (e.key === 'h') {
        Game.toggleHint();
    }
    if (e.key === 'b') {
        Game.toggleVisited();
    }
});
