import { useState, useEffect, useCallback } from 'react';
import './Game2048.css';

const Game2048 = () => {
    const [board, setBoard] = useState(Array(4).fill().map(() => Array(4).fill(0)));
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [touchStart, setTouchStart] = useState(null);

    const initializeGame = () => {
        const newBoard = Array(4).fill().map(() => Array(4).fill(0));
        addRandomTile(newBoard);
        addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(0);
        setGameOver(false);
    };

    const addRandomTile = (currentBoard) => {
        const available = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentBoard[r][c] === 0) available.push({ r, c });
            }
        }
        if (available.length > 0) {
            const { r, c } = available[Math.floor(Math.random() * available.length)];
            currentBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    };

    const moveLeft = (currentBoard) => {
        let newBoard = JSON.parse(JSON.stringify(currentBoard));
        let moved = false;
        let addedScore = 0;

        for (let r = 0; r < 4; r++) {
            let row = newBoard[r].filter(val => val !== 0);
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    addedScore += row[i];
                    row.splice(i + 1, 1);
                }
            }
            while (row.length < 4) row.push(0);
            if (JSON.stringify(newBoard[r]) !== JSON.stringify(row)) moved = true;
            newBoard[r] = row;
        }
        return { newBoard, moved, addedScore };
    };

    const rotateBoard = (currentBoard) => {
        const newBoard = Array(4).fill().map(() => Array(4).fill(0));
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                newBoard[c][3 - r] = currentBoard[r][c];
            }
        }
        return newBoard;
    };

    const move = useCallback((direction) => {
        if (gameOver) return;

        let currentBoard = board;
        let rotations = 0;

        if (direction === 'up') rotations = 3;
        else if (direction === 'right') rotations = 2;
        else if (direction === 'down') rotations = 1;

        for (let i = 0; i < rotations; i++) currentBoard = rotateBoard(currentBoard);

        const { newBoard: movedBoard, moved, addedScore } = moveLeft(currentBoard);

        if (moved) {
            let finalBoard = movedBoard;
            for (let i = 0; i < (4 - rotations) % 4; i++) finalBoard = rotateBoard(finalBoard);

            addRandomTile(finalBoard);
            setBoard(finalBoard);
            setScore(prev => prev + addedScore);

            if (checkGameOver(finalBoard)) {
                setGameOver(true);
            }
        }
    }, [board, gameOver]);

    const checkGameOver = (currentBoard) => {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentBoard[r][c] === 0) return false;
                if (c < 3 && currentBoard[r][c] === currentBoard[r][c + 1]) return false;
                if (r < 3 && currentBoard[r][c] === currentBoard[r + 1][c]) return false;
            }
        }
        return true;
    };

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp': move('up'); break;
                case 'ArrowDown': move('down'); break;
                case 'ArrowLeft': move('left'); break;
                case 'ArrowRight': move('right'); break;
                default: return;
            }
            e.preventDefault();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    // Touch Handlers
    const handleTouchStart = (e) => {
        setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    };

    const handleTouchEnd = (e) => {
        if (!touchStart) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY
        };

        const dx = touchEnd.x - touchStart.x;
        const dy = touchEnd.y - touchStart.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (Math.abs(dx) > 30) { // Threshold
                move(dx > 0 ? 'right' : 'left');
            }
        } else {
            // Vertical swipe
            if (Math.abs(dy) > 30) {
                move(dy > 0 ? 'down' : 'up');
            }
        }
        setTouchStart(null);
    };

    return (
        <div className="game2048-container">
            <div className="header-2048">
                <div className="score-box">
                    <span>Score</span>
                    <strong>{score}</strong>
                </div>
                <button className="new-game-btn" onClick={initializeGame}>New Game</button>
            </div>

            <div
                className="board-2048"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {board.map((row, r) => (
                    <div key={r} className="row-2048">
                        {row.map((cell, c) => (
                            <div key={`${r}-${c}`} className={`cell-2048 val-${cell}`}>
                                {cell !== 0 ? cell : ''}
                            </div>
                        ))}
                    </div>
                ))}
                {gameOver && (
                    <div className="game-over-overlay">
                        <h2>Game Over!</h2>
                        <button onClick={initializeGame}>Try Again</button>
                    </div>
                )}
            </div>
            <p className="instructions">Use arrow keys or swipe to move tiles</p>
        </div>
    );
};

export default Game2048;
