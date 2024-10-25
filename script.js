const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const patternSelect = document.getElementById('patternSelect');
    const clearButton = document.getElementById('clearButton');

    const gridSize = 50;
    const cellSize = 10;
    const grid = [];
    let evolutionSpeed = 100; // milliseconds
    let isDrawing = false;

    function initializeGrid() {
      for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
          grid[i][j] = 0; // 0: dead, 1: alive
        }
      }
    }

    function setPattern(pattern) {
      initializeGrid();
      if (pattern === 'glider') {
        grid[1][2] = 1;
        grid[2][3] = 1;
        grid[3][1] = 1;
        grid[3][2] = 1;
        grid[3][3] = 1;
      } else if (pattern === 'blinker') {
        grid[2][1] = 1;
        grid[2][2] = 1;
        grid[2][3] = 1;
      }
      drawGrid();
    }

    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          ctx.fillStyle = grid[i][j] === 1 ? 'white' : 'black';
          ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
      }
    }

    function countLiveNeighbors(row, col) {
      let count = 0;
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (
            i >= 0 &&
            i < gridSize &&
            j >= 0 &&
            j < gridSize &&
            (i !== row || j !== col) &&
            grid[i][j] === 1
          ) {
            count++;
          }
        }
      }
      return count;
    }

    function updateGrid() {
      const newGrid = [];
      for (let i = 0; i < gridSize; i++) {
        newGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
          const liveNeighbors = countLiveNeighbors(i, j);
          if (grid[i][j] === 1) {
            newGrid[i][j] = liveNeighbors < 2 || liveNeighbors > 3 ? 0 : 1;
          } else {
            newGrid[i][j] = liveNeighbors === 3 ? 1 : 0;
          }
        }
      }
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          grid[i][j] = newGrid[i][j];
        }
      }
    }

    function gameLoop() {
      drawGrid();
      updateGrid();
    }

    function handleCanvasClick(event) {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / cellSize);
      const y = Math.floor((event.clientY - rect.top) / cellSize);
      grid[y][x] = grid[y][x] === 0 ? 1 : 0;
      drawGrid();
    }

    function handleMouseDown(event) {
      isDrawing = true;
      handleCanvasClick(event);
    }

    function handleMouseUp() {
      isDrawing = false;
    }

    function handleMouseMove(event) {
      if (isDrawing) {
        handleCanvasClick(event);
      }
    }

    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    initializeGrid();
    setPattern('glider');
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    patternSelect.addEventListener('change', (event) => {
      setPattern(event.target.value);
    });
    clearButton.addEventListener('click', () => {
      initializeGrid();
      drawGrid();
    });

    setInterval(gameLoop, evolutionSpeed);
