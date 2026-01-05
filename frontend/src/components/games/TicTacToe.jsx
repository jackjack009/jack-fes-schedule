import { useState, useEffect, useCallback } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player is always X
    const [winner, setWinner] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]); // Track order of moves

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const minimax = (squares, depth, isMaximizing) => {
        const result = calculateWinner(squares);
        if (result === 'O') return 10 - depth;
        if (result === 'X') return depth - 10;
        if (!squares.includes(null)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!squares[i]) {
                    squares[i] = 'O';
                    const score = minimax(squares, depth + 1, false);
                    squares[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!squares[i]) {
                    squares[i] = 'X';
                    const score = minimax(squares, depth + 1, true);
                    squares[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const makeBotMove = useCallback(() => {
        if (winner) return;

        let bestScore = -Infinity;
        let move = -1;
        const newBoard = [...board];

        // First move optimization: take center if available
        if (board.filter(s => s).length === 1 && !board[4]) {
            move = 4;
        } else {
            for (let i = 0; i < 9; i++) {
                if (!newBoard[i]) {
                    newBoard[i] = 'O';
                    const score = minimax(newBoard, 0, false);
                    newBoard[i] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        move = i;
                    }
                }
            }
        }

        if (move !== -1) {

            const finalBoard = [...board];
            let newMoveHistory = [...moveHistory];

            finalBoard[move] = 'O';
            newMoveHistory.push(move);

            setBoard(finalBoard);
            setMoveHistory(newMoveHistory);

            const gameWinner = calculateWinner(finalBoard);
            if (gameWinner) {
                setWinner(gameWinner);
            } else {
                setIsPlayerTurn(true);
            }
        }
    }, [board, winner, moveHistory]);

    useEffect(() => {
        if (!isPlayerTurn && !winner) {
            // Small delay for realism
            const timer = setTimeout(() => {
                makeBotMove();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, winner, makeBotMove]);

    // Auto-remove oldest move when board is full (after move #9)
    useEffect(() => {
        if (moveHistory.length === 9 && !winner && !board.includes(null)) {
            const timer = setTimeout(() => {
                const newBoard = [...board];
                const newMoveHistory = [...moveHistory];
                const oldestMove = newMoveHistory.shift();
                newBoard[oldestMove] = null;
                setBoard(newBoard);
                setMoveHistory(newMoveHistory);
            }, 800); // Small delay to see the full board before removal
            return () => clearTimeout(timer);
        }
    }, [moveHistory, winner, board]);

    const handleClick = (i) => {
        if (winner || board[i] || !isPlayerTurn) return;


        const newBoard = [...board];
        let newMoveHistory = [...moveHistory];

        newBoard[i] = 'X';
        newMoveHistory.push(i);

        setBoard(newBoard);
        setMoveHistory(newMoveHistory);

        const gameWinner = calculateWinner(newBoard);
        if (gameWinner) {
            setWinner(gameWinner);
        } else {
            setIsPlayerTurn(false);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
        setMoveHistory([]);
    };

    return (
        <div className="tictactoe-container">
            <div className="status">
                {winner
                    ? (winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner === 'X' ? 'You' : 'Bot'}`)
                    : (isPlayerTurn ? "Your Turn (X)" : "Bot is thinking...")}
            </div>
            <div className="board">
                {board.map((square, i) => (
                    <button
                        key={i}
                        className={`square ${square ? square.toLowerCase() : ''}`}
                        onClick={() => handleClick(i)}
                        disabled={!isPlayerTurn || winner || square}
                    >
                        {square}
                    </button>
                ))}
            </div>
            <button className="reset-btn" onClick={resetGame}>
                Reset Game
            </button>
        </div>
    );
};

export default TicTacToe;
