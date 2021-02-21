let Graphics = (function() {
    'use strict';

    let mazeData = [];
    let canvas = document.getElementById('gameCanvas');
    let context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function clear() {
        context.clear();
    }

    function drawMaze(maze, mazeSize) {
        mazeData = maze;
        context.beginPath();
        let cellSize = canvas.width / mazeSize;
        let position = { x: 0, y: 0 };
        for (let i = 0; i < maze.length; i++) {
            position.x = 0;
            context.moveTo(position.x, position.y);
            for (let j = 0; j < maze[i].length; j++) {
                position.x += cellSize;
                if (maze[i][j].top.wall) {
                    context.lineTo(position.x, position.y);
                } else {
                    context.moveTo(position.x, position.y);
                }
                position.y += cellSize;
                if (maze[i][j].right.wall) {
                    context.lineTo(position.x, position.y);
                } else {
                    context.moveTo(position.x, position.y);
                }
                position.x -= cellSize;
                if (maze[i][j].bottom.wall) {
                    context.lineTo(position.x, position.y);
                } else {
                    context.moveTo(position.x, position.y);
                }
                position.y -= cellSize;
                if (maze[i][j].left.wall) {
                    context.lineTo(position.x, position.y);
                } else {
                    context.moveTo(position.x, position.y);
                }
                position.x += cellSize;
                context.moveTo(position.x, position.y);
            }
            position.y += cellSize;
        }
        context.closePath();
        context.strokeStyle = '#000000';
        context.stroke();
    }

    function Texture(spec) {
        let that = {};
        let ready = false;
        let image = new Image();
        let nextEvent = 0;
        let totalTime = 0;

        image.onload = function() {
            ready = true;
        };
        image.src = spec.image;

        that.getPositionX = function() {
            return spec.positionX;
        };

        that.getPositionY = function() {
            return spec.positionY;
        };

        that.moveLeft = function(elapsedTime) {
            totalTime += elapsedTime;
            if (spec.positionX > 0 && !mazeData[spec.positionY][spec.positionX].left.wall && nextEvent <= totalTime) {
                nextEvent = totalTime + 200;
                spec.center.x -= spec.moveRate;
                spec.positionX -= 1;
            }
        };

        that.moveRight = function(elapsedTime) {
            totalTime += elapsedTime;
            if (spec.positionX < mazeData.length && !mazeData[spec.positionY][spec.positionX].right.wall  && nextEvent <= totalTime) {
                nextEvent = totalTime + 200;
                spec.center.x += spec.moveRate;
                spec.positionX += 1;
            }
        };

        that.moveUp = function(elapsedTime) {
            totalTime += elapsedTime;
            if (spec.positionY > 0 && !mazeData[spec.positionY][spec.positionX].top.wall  && nextEvent <= totalTime) {
                nextEvent = totalTime + 200;
                spec.center.y -= spec.moveRate;
                spec.positionY -= 1;
            }
        };

        that.moveDown = function(elapsedTime) {
            totalTime += elapsedTime;
            if (spec.positionY < mazeData.length && !mazeData[spec.positionY][spec.positionX].bottom.wall  && nextEvent <= totalTime) {
                nextEvent = totalTime + 200;
                spec.center.y += spec.moveRate;
                spec.positionY += 1;
            }
        };

        that.resetMovement = function() {
            nextEvent = 0;
            totalTime = 0;
        };

        that.draw = function() {
            if (ready) {
                context.drawImage(
                    image,
                    spec.center.x - spec.width/2,
                    spec.center.y - spec.height/2,
                    spec.width, spec.height
                );
            }
        };

        return that;
    }

    return {
        clear : clear,
        drawMaze : drawMaze,
        Texture : Texture,
    };
}());
