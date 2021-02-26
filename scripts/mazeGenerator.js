let MazeGenerator = (function() {
    let size;
    let maze;
    let frontier;
    let solutionPath;
    let solutionVisited;

    function generateMaze(mazeSize) {
        _setup(mazeSize);
        _initializeEmptyMaze();
        _removeWalls();
        return maze;
    }

    function _setup(mazeSize) {
        size = mazeSize;
        maze = [];
        frontier = [];
    }

    function _initializeEmptyMaze() {
        for (let i = 0; i < size; i++) {
            maze.push([]);
            for (let j = 0; j < size; j++) {
                maze[i].push({
                    top: {
                        wall: true,
                        touchingFrontier: false
                    },
                    right: {
                        wall: true,
                        touchingFrontier: false
                    },
                    bottom: {
                        wall: true,
                        touchingFrontier: false
                    },
                    left: {
                        wall: true,
                        touchingFrontier: false
                    },
                    inMaze: false,
                })
            }
        }
    }

    function _removeWalls() {
        let mazePositions = [];
        let positionY = Math.floor(Math.random() * Math.floor(size));
        let positionX = Math.floor(Math.random() * Math.floor(size));
        mazePositions.push([positionY, positionX]);
        _addToFrontier(positionY, positionX);
        _addToMaze(positionY, positionX);
        while (frontier.length > 0) {
            let nextFrontierPosition = Math.floor(Math.random() * Math.floor(frontier.length));
            let next = frontier[nextFrontierPosition];
            frontier.splice(nextFrontierPosition, 1);
            _addToMaze(next[0], next[1]);
            mazePositions.push([next[0], next[1]]);
            for (let i = 0; i < mazePositions.length; i++) {
                _addToFrontier(next[0], next[1]);
            }
        }
    }

    function _addToFrontier(positionY, positionX) {
        if (positionY > 0 && !maze[positionY - 1][positionX].inMaze) {
            if (!_frontierContains(positionY - 1, positionX)) {
                frontier.push([positionY - 1, positionX]);
            }
            maze[positionY - 1][positionX].bottom.touchingFrontier = true;
            maze[positionY][positionX].top.touchingFrontier = true;
        }
        if (positionY < size - 1 && !maze[positionY + 1][positionX].inMaze) {
            if (!_frontierContains(positionY + 1, positionX)) {
                frontier.push([positionY + 1, positionX]);
            }
            maze[positionY + 1][positionX].top.touchingFrontier = true;
            maze[positionY][positionX].bottom.touchingFrontier = true;
        }
        if (positionX > 0 && !maze[positionY][positionX - 1].inMaze) {
            if (!_frontierContains(positionY, positionX - 1)) {
                frontier.push([positionY, positionX - 1]);
            }
            maze[positionY][positionX - 1].right.touchingFrontier = true;
            maze[positionY][positionX].left.touchingFrontier = true;
        }
        if (positionX < size - 1 && !maze[positionY][positionX + 1].inMaze) {
            if (!_frontierContains(positionY, positionX + 1)) {
                frontier.push([positionY, positionX + 1]);
            }
            maze[positionY][positionX + 1].left.touchingFrontier = true;
            maze[positionY][positionX].right.touchingFrontier = true;
        }
    }

    function _frontierContains(y, x) {
        for (let i = 0; i < frontier.length; i++) {
            if (frontier[i][0] === y && frontier[i][1] === x) {
                return true;
            }
        }
        return false;
    }

    function _addToMaze(positionY, positionX) {
        let sidesTouchingFrontier = [];
        let adjacentWallsToRemove = {
            top: false,
            bottom: false,
            left: false,
            right: false,
        };
        if (maze[positionY][positionX].top.touchingFrontier) {
            sidesTouchingFrontier.push('top');
            if (positionY > 0) {
                adjacentWallsToRemove.top = {
                    y: positionY - 1,
                    x: positionX,
                    wall: 'bottom',
                }
            }
        }
        if (maze[positionY][positionX].bottom.touchingFrontier) {
            sidesTouchingFrontier.push('bottom');
            if (positionY < size - 1) {
                adjacentWallsToRemove.bottom = {
                    y: positionY + 1,
                    x: positionX,
                    wall: 'top',
                }
            }
        }
        if (maze[positionY][positionX].left.touchingFrontier) {
            sidesTouchingFrontier.push('left');
            if (positionX > 0) {
                adjacentWallsToRemove.left = {
                    y: positionY,
                    x: positionX - 1,
                    wall: 'right',
                }
            }
        }
        if (maze[positionY][positionX].right.touchingFrontier) {
            sidesTouchingFrontier.push('right');
            if (positionX < size - 1) {
                adjacentWallsToRemove.right = {
                    y: positionY,
                    x: positionX + 1,
                    wall: 'left',
                }
            }
        }
        let randomPosition = Math.floor(Math.random() * Math.floor(sidesTouchingFrontier.length));
        let wallToRemove = sidesTouchingFrontier[randomPosition];
        let adjacentWallToRemove = adjacentWallsToRemove[wallToRemove];
        if (adjacentWallToRemove !== false) {
            maze[positionY][positionX][wallToRemove].wall = false;
            maze[adjacentWallToRemove.y][adjacentWallToRemove.x][adjacentWallToRemove.wall].wall = false;
        }
        maze[positionY][positionX].inMaze = true;
    }

    function solveMaze() {
        _solutionSetup();
        _recursiveSolve(0, 0);
        console.log(solutionPath);
        return solutionPath;
    }

    function _solutionSetup() {
        solutionPath = [];
        solutionVisited = [];
        for (let i = 0; i < size; i++) {
            solutionVisited.push([]);
            for (let j = 0; j < size; j++) {
                solutionVisited[i].push(false);
            }
        }
    }

    function _recursiveSolve(positionY, positionX) {
        if (positionY === maze.length - 1 && positionX === maze.length - 1) {
            return true;
        }
        if (solutionVisited[positionY][positionX]) {
            return false;
        }
        solutionVisited[positionY][positionX] = true;
        if (positionX > 0 && !maze[positionY][positionX].left.wall) {
            if (_recursiveSolve(positionY, positionX - 1)) {
                solutionPath.unshift({x: positionX, y: positionY});
                return true;
            }
        }
        if (positionX < maze.length - 1 && !maze[positionY][positionX].right.wall) {
            if (_recursiveSolve(positionY, positionX + 1)) {
                solutionPath.unshift({x: positionX, y: positionY});
                return true;
            }
        }
        if (positionY > 0 && !maze[positionY][positionX].top.wall) {
            if (_recursiveSolve(positionY - 1, positionX)) {
                solutionPath.unshift({x: positionX, y: positionY});
                return true;
            }
        }
        if (positionY < maze.length - 1&& !maze[positionY][positionX].bottom.wall) {
            if (_recursiveSolve(positionY + 1, positionX)) {
                solutionPath.unshift({x: positionX, y: positionY});
                return true;
            }
        }
        return false;
    }

    function printMaze(maze) {
        let mazeString = '';
        mazeString += ' _ _ _ _ _ \n'; // make this string as long as the maze size. I know this lazy but I did it anyway
        for (let i = 0; i < maze.length; i++) {
            mazeString += '|';
            for (let j = 0; j < maze[i].length; j++) {
                if (maze[i][j].bottom.wall) {
                    mazeString += '_';
                } else {
                    mazeString += ' ';
                }
                if (maze[i][j].right.wall) {
                    mazeString += '|';
                } else {
                    mazeString += ' ';
                }
            }
            mazeString += '\n';
        }
        console.log(mazeString);
    }

    return {
        generateMaze: generateMaze,
        solveMaze: solveMaze,
        printMaze: printMaze,
    }
})();
