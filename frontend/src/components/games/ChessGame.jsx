import { useState, useEffect, useCallback } from 'react';
import './ChessGame.css';

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const PIECES = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const PIECE_VALUES = {
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100,
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 100
};

const ChessGame = () => {
    const [board, setBoard] = useState(initialBoard);
    const [turn, setTurn] = useState('white'); // white (Player) or black (Bot)
    const [selected, setSelected] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing'); // playing, checkmate, draw

    const isWhite = (piece) => piece === piece.toUpperCase();
    const isBlack = (piece) => piece === piece.toLowerCase();
    const getPieceColor = (piece) => piece ? (isWhite(piece) ? 'white' : 'black') : null;

    // Helper: Check if path is clear (for sliding pieces)
    const isPathClear = (startR, startC, endR, endC, currentBoard) => {
        const dR = Math.sign(endR - startR);
        const dC = Math.sign(endC - startC);
        let r = startR + dR;
        let c = startC + dC;

        while (r !== endR || c !== endC) {
            if (currentBoard[r][c]) return false;
            r += dR;
            c += dC;
        }
        return true;
    };

    // Helper: Validate move
    const isValidMove = (startR, startC, endR, endC, piece, currentBoard) => {
        const target = currentBoard[endR][endC];
        if (target && getPieceColor(target) === getPieceColor(piece)) return false;

        const dR = endR - startR;
        const dC = endC - startC;
        const absDR = Math.abs(dR);
        const absDC = Math.abs(dC);
        const type = piece.toLowerCase();

        switch (type) {
            case 'p': // Pawn
                const direction = isWhite(piece) ? -1 : 1;
                const startRow = isWhite(piece) ? 6 : 1;

                // Move forward 1
                if (dC === 0 && dR === direction && !target) return true;
                // Move forward 2
                if (dC === 0 && dR === direction * 2 && startR === startRow && !target && !currentBoard[startR + direction][startC]) return true;
                // Capture
                if (absDC === 1 && dR === direction && target) return true;
                return false;

            case 'r': // Rook
                if (dR !== 0 && dC !== 0) return false;
                return isPathClear(startR, startC, endR, endC, currentBoard);

            case 'b': // Bishop
                if (absDR !== absDC) return false;
                return isPathClear(startR, startC, endR, endC, currentBoard);

            case 'q': // Queen
                if (dR !== 0 && dC !== 0 && absDR !== absDC) return false;
                return isPathClear(startR, startC, endR, endC, currentBoard);

            case 'n': // Knight
                return (absDR === 2 && absDC === 1) || (absDR === 1 && absDC === 2);

            case 'k': // King
                return absDR <= 1 && absDC <= 1;

            default:
                return false;
        }
    };

    // Bot Logic
    const makeBotMove = useCallback(() => {
        if (gameStatus !== 'playing') return;

        // Find all black pieces
        const blackPieces = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                if (piece && isBlack(piece)) {
                    blackPieces.push({ r, c, piece });
                }
            }
        }

        // Find all valid moves for all black pieces
        let allMoves = [];
        blackPieces.forEach(({ r, c, piece }) => {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (isValidMove(r, c, i, j, piece, board)) {
                        const target = board[i][j];
                        const score = target ? PIECE_VALUES[target] : 0;
                        allMoves.push({ startR: r, startC: c, endR: i, endC: j, score });
                    }
                }
            }
        });

        if (allMoves.length === 0) {
            setGameStatus('checkmate'); // Or stalemate, but simplifying
            return;
        }

        // Sort moves by score (capture high value pieces first)
        allMoves.sort((a, b) => b.score - a.score);

        // Filter for top moves (best captures) or random if no captures
        const bestScore = allMoves[0].score;
        const bestMoves = allMoves.filter(m => m.score === bestScore);
        const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

        // Execute move
        const newBoard = board.map(row => [...row]);
        newBoard[selectedMove.endR][selectedMove.endC] = board[selectedMove.startR][selectedMove.startC];
        newBoard[selectedMove.startR][selectedMove.startC] = null;

        // Promotion (Auto Queen)
        if (newBoard[selectedMove.endR][selectedMove.endC] === 'p' && selectedMove.endR === 7) {
            newBoard[selectedMove.endR][selectedMove.endC] = 'q';
        }

        setBoard(newBoard);
        setTurn('white');
    }, [board, gameStatus]);

    // Trigger Bot Move
    useEffect(() => {
        if (turn === 'black' && gameStatus === 'playing') {
            const timer = setTimeout(() => {
                makeBotMove();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [turn, gameStatus, makeBotMove]);

    const handleSquareClick = (r, c) => {
        if (turn !== 'white' || gameStatus !== 'playing') return;

        const piece = board[r][c];
        const isOwnPiece = piece && isWhite(piece);

        if (isOwnPiece) {
            setSelected({ r, c });
            const moves = [];
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (isValidMove(r, c, i, j, piece, board)) {
                        moves.push(`${i},${j}`);
                    }
                }
            }
            setPossibleMoves(moves);
        } else if (selected) {
            if (possibleMoves.includes(`${r},${c}`)) {
                // Move
                const newBoard = board.map(row => [...row]);
                newBoard[r][c] = board[selected.r][selected.c];
                newBoard[selected.r][selected.c] = null;

                // Promotion (Auto Queen)
                if (newBoard[r][c] === 'P' && r === 0) {
                    newBoard[r][c] = 'Q';
                }

                setBoard(newBoard);
                setTurn('black');
                setSelected(null);
                setPossibleMoves([]);
            } else {
                setSelected(null);
                setPossibleMoves([]);
            }
        }
    };

    const resetGame = () => {
        setBoard(initialBoard);
        setTurn('white');
        setSelected(null);
        setPossibleMoves([]);
        setGameStatus('playing');
    };

    return (
        <div className="chess-container">
            <div className="status">
                {gameStatus === 'playing' ? (
                    <>Turn: <span className={turn}>{turn === 'white' ? 'You (White)' : 'Bot (Black)'}</span></>
                ) : (
                    <span className="game-over">Game Over!</span>
                )}
            </div>
            <div className="chess-board">
                {board.map((row, r) => (
                    <div key={r} className="chess-row">
                        {row.map((piece, c) => {
                            const isSelected = selected?.r === r && selected?.c === c;
                            const isPossible = possibleMoves.includes(`${r},${c}`);
                            const isBlackSquare = (r + c) % 2 === 1;

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    className={`chess-square ${isBlackSquare ? 'black' : 'white'} ${isSelected ? 'selected' : ''} ${isPossible ? 'possible' : ''}`}
                                    onClick={() => handleSquareClick(r, c)}
                                >
                                    {piece && <span className={`chess-piece ${getPieceColor(piece)}`}>{PIECES[piece]}</span>}
                                    {isPossible && !piece && <div className="move-dot"></div>}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <button className="reset-btn" onClick={resetGame}>Reset Game</button>
        </div>
    );
};

export default ChessGame;
