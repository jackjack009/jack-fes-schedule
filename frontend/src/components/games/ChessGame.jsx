import { useState, useEffect, useCallback } from 'react';
import './ChessGame.css';

// Constants
const WHITE = 0;
const BLACK = 1;
const EMPTY = 0, PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6;

const PIECES = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

// Chess Logic Engine
class ChessLogic {
    constructor() {
        this.board = new Array(64).fill(null);
        this.turn = WHITE;
        this.history = [];
        this.gameOver = false;
        this.loadFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }

    reset() {
        this.loadFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        this.gameOver = false;
    }

    loadFEN(fen) {
        const parts = fen.split(' ');
        let rows = parts[0].split('/');
        this.board.fill(null);
        for (let r = 0; r < 8; r++) {
            let c = 0;
            for (let char of rows[r]) {
                if (/\d/.test(char)) {
                    c += parseInt(char);
                } else {
                    const color = (char === char.toUpperCase()) ? WHITE : BLACK;
                    const type = { p: PAWN, n: KNIGHT, b: BISHOP, r: ROOK, q: QUEEN, k: KING }[char.toLowerCase()];
                    this.board[r * 8 + c] = { type, color };
                    c++;
                }
            }
        }
        this.turn = (parts[1] === 'w') ? WHITE : BLACK;
        this.history = [];
    }

    generateMoves(color = this.turn) {
        const moves = [];
        for (let i = 0; i < 64; i++) {
            const p = this.board[i];
            if (p && p.color === color) {
                this.getPieceMoves(i, p, moves);
            }
        }
        return moves;
    }

    getPieceMoves(idx, piece, moves) {
        const r = Math.floor(idx / 8);
        const c = idx % 8;
        const dirs = {
            [KNIGHT]: [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]],
            [BISHOP]: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
            [ROOK]: [[-1, 0], [1, 0], [0, -1], [0, 1]],
            [QUEEN]: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]],
            [KING]: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]
        };

        const isSliding = [BISHOP, ROOK, QUEEN].includes(piece.type);

        if (piece.type === PAWN) {
            const forward = (piece.color === WHITE) ? -1 : 1;
            const startRow = (piece.color === WHITE) ? 6 : 1;

            const f1 = idx + forward * 8;
            if (f1 >= 0 && f1 < 64 && !this.board[f1]) {
                moves.push({ from: idx, to: f1, type: 'move' });
                const f2 = idx + forward * 16;
                if (r === startRow && !this.board[f2]) {
                    moves.push({ from: idx, to: f2, type: 'move' });
                }
            }

            for (let dc of [-1, 1]) {
                if (c + dc >= 0 && c + dc < 8) {
                    const target = idx + forward * 8 + dc;
                    const targetP = this.board[target];
                    if (targetP && targetP.color !== piece.color) {
                        moves.push({ from: idx, to: target, type: 'capture' });
                    }
                }
            }
        } else {
            const directions = dirs[piece.type];
            for (let d of directions) {
                let nr = r + d[0];
                let nc = c + d[1];
                while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                    const target = nr * 8 + nc;
                    const targetP = this.board[target];
                    if (!targetP) {
                        moves.push({ from: idx, to: target, type: 'move' });
                    } else {
                        if (targetP.color !== piece.color) {
                            moves.push({ from: idx, to: target, type: 'capture' });
                        }
                        break;
                    }
                    if (!isSliding) break;
                    nr += d[0];
                    nc += d[1];
                }
            }
        }
    }

    isSquareAttacked(sq, color) {
        const opponent = (color === WHITE) ? BLACK : WHITE;

        if (color === WHITE) {
            if (sq - 9 >= 0 && (sq % 8) > 0 && this.board[sq - 9]?.type === PAWN && this.board[sq - 9].color === BLACK) return true;
            if (sq - 7 >= 0 && (sq % 8) < 7 && this.board[sq - 7]?.type === PAWN && this.board[sq - 7].color === BLACK) return true;
        } else {
            if (sq + 9 < 64 && (sq % 8) < 7 && this.board[sq + 9]?.type === PAWN && this.board[sq + 9].color === WHITE) return true;
            if (sq + 7 < 64 && (sq % 8) > 0 && this.board[sq + 7]?.type === PAWN && this.board[sq + 7].color === WHITE) return true;
        }

        const dirs = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1],
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        const r = Math.floor(sq / 8);
        const c = sq % 8;

        for (let i = 0; i < dirs.length; i++) {
            const d = dirs[i];
            let nr = r + d[0];
            let nc = c + d[1];
            let dist = 0;
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                dist++;
                const target = nr * 8 + nc;
                const p = this.board[target];
                if (p) {
                    if (p.color === opponent) {
                        if (i < 8) {
                            if (p.type === KNIGHT && dist === 1) return true;
                        } else if (i < 12) {
                            if ((p.type === BISHOP || p.type === QUEEN) || (p.type === KING && dist === 1)) return true;
                        } else {
                            if ((p.type === ROOK || p.type === QUEEN) || (p.type === KING && dist === 1)) return true;
                        }
                    }
                    break;
                }
                nr += d[0];
                nc += d[1];
            }
        }
        return false;
    }

    makeMove(move) {
        const state = {
            board: [...this.board],
            turn: this.turn
        };

        const p = this.board[move.from];
        this.board[move.to] = p;
        this.board[move.from] = null;

        if (p.type === PAWN && (move.to < 8 || move.to >= 56)) {
            this.board[move.to] = { type: QUEEN, color: p.color };
        }

        this.turn = (this.turn === WHITE) ? BLACK : WHITE;
        this.history.push(state);
        return state;
    }

    undoMove() {
        const state = this.history.pop();
        if (!state) return;
        this.board = state.board;
        this.turn = state.turn;
    }

    getLegalMoves(color = this.turn) {
        const pseudo = this.generateMoves(color);
        const legal = [];
        for (let m of pseudo) {
            this.makeMove(m);
            let kingIdx = -1;
            for (let i = 0; i < 64; i++) {
                if (this.board[i] && this.board[i].type === KING && this.board[i].color === color) {
                    kingIdx = i;
                    break;
                }
            }
            if (kingIdx !== -1 && !this.isSquareAttacked(kingIdx, color)) {
                legal.push(m);
            }
            this.undoMove();
        }
        return legal;
    }

    isCheck(color = this.turn) {
        let kingIdx = -1;
        for (let i = 0; i < 64; i++) {
            if (this.board[i] && this.board[i].type === KING && this.board[i].color === color) {
                kingIdx = i;
                break;
            }
        }
        return (kingIdx !== -1 && this.isSquareAttacked(kingIdx, color));
    }

    checkGameState() {
        const moves = this.getLegalMoves(this.turn);
        if (moves.length === 0) {
            if (this.isCheck(this.turn)) return 'checkmate';
            return 'stalemate';
        }
        return null;
    }
}

// AI with Minimax
class ChessAI {
    constructor(game) {
        this.game = game;
        this.weights = { [PAWN]: 100, [KNIGHT]: 320, [BISHOP]: 330, [ROOK]: 500, [QUEEN]: 900, [KING]: 20000 };

        const pawnTable = [
            0, 0, 0, 0, 0, 0, 0, 0,
            50, 50, 50, 50, 50, 50, 50, 50,
            10, 10, 20, 30, 30, 20, 10, 10,
            5, 5, 10, 25, 25, 10, 5, 5,
            0, 0, 0, 20, 20, 0, 0, 0,
            5, -5, -10, 0, 0, -10, -5, 5,
            5, 10, 10, -20, -20, 10, 10, 5,
            0, 0, 0, 0, 0, 0, 0, 0
        ];
        const knightTable = [
            -50, -40, -30, -30, -30, -30, -40, -50,
            -40, -20, 0, 0, 0, 0, -20, -40,
            -30, 0, 10, 15, 15, 10, 0, -30,
            -30, 5, 15, 20, 20, 15, 5, -30,
            -30, 0, 15, 20, 20, 15, 0, -30,
            -30, 5, 10, 15, 15, 10, 5, -30,
            -40, -20, 0, 5, 5, 0, -20, -40,
            -50, -40, -30, -30, -30, -30, -40, -50
        ];
        const mirror = (table) => {
            const newT = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) newT.push(table[(7 - r) * 8 + c]);
            }
            return newT;
        };

        this.pst = {
            [WHITE]: { [PAWN]: pawnTable, [KNIGHT]: knightTable, [BISHOP]: knightTable },
            [BLACK]: { [PAWN]: mirror(pawnTable), [KNIGHT]: mirror(knightTable), [BISHOP]: mirror(knightTable) }
        };
    }

    evaluate() {
        let score = 0;
        for (let i = 0; i < 64; i++) {
            const p = this.game.board[i];
            if (!p) continue;
            let val = this.weights[p.type];
            if (this.pst[p.color][p.type]) {
                val += this.pst[p.color][p.type][i] || 0;
            }

            if (p.color === WHITE) score += val;
            else score -= val;
        }
        return score;
    }

    getBestMove(depth) {
        const moves = this.game.getLegalMoves();
        if (moves.length === 0) return null;

        moves.sort((a, b) => {
            const scoreA = (a.type === 'capture' ? 10 : 0);
            const scoreB = (b.type === 'capture' ? 10 : 0);
            return scoreB - scoreA;
        });

        let bestMove = moves[0];
        let bestValue = -Infinity;

        for (const move of moves) {
            this.game.makeMove(move);
            const value = -this.minimax(depth - 1, -Infinity, Infinity);
            this.game.undoMove();

            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }
        return bestMove;
    }

    minimax(depth, alpha, beta) {
        if (depth === 0) return (this.game.turn === WHITE ? 1 : -1) * this.evaluate();

        const moves = this.game.getLegalMoves();
        if (moves.length === 0) {
            if (this.game.isCheck()) return -20000 + (10 - depth);
            return 0;
        }

        let best = -Infinity;
        for (const move of moves) {
            this.game.makeMove(move);
            const val = -this.minimax(depth - 1, -beta, -alpha);
            this.game.undoMove();

            best = Math.max(best, val);
            alpha = Math.max(alpha, val);
            if (alpha >= beta) break;
        }
        return best;
    }
}

const ChessGame = () => {
    const [board, setBoard] = useState([]);
    const [turn, setTurn] = useState('white');
    const [selected, setSelected] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing');
    const [difficulty, setDifficulty] = useState('medium');
    const [logic] = useState(() => new ChessLogic());
    const [ai] = useState(() => new ChessAI(logic));

    const syncBoard = useCallback(() => {
        const newBoard = [];
        for (let r = 0; r < 8; r++) {
            const row = [];
            for (let c = 0; c < 8; c++) {
                const piece = logic.board[r * 8 + c];
                if (piece) {
                    const colorKey = piece.color === WHITE ? 'w' : 'b';
                    const typeKey = { [PAWN]: 'p', [KNIGHT]: 'n', [BISHOP]: 'b', [ROOK]: 'r', [QUEEN]: 'q', [KING]: 'k' }[piece.type];
                    row.push(colorKey === 'w' ? typeKey.toUpperCase() : typeKey);
                } else {
                    row.push(null);
                }
            }
            newBoard.push(row);
        }
        setBoard(newBoard);
        setTurn(logic.turn === WHITE ? 'white' : 'black');
    }, [logic]);

    useEffect(() => {
        syncBoard();
    }, [syncBoard]);

    const makeBotMove = useCallback(() => {
        if (gameStatus !== 'playing' || logic.turn !== BLACK) return;

        setTimeout(() => {
            const depth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
            const move = ai.getBestMove(depth);

            if (move) {
                logic.makeMove(move);
                syncBoard();

                const state = logic.checkGameState();
                if (state === 'checkmate') {
                    setGameStatus('lost');
                } else if (state === 'stalemate') {
                    setGameStatus('draw');
                }
            }
        }, 500);
    }, [logic, ai, difficulty, gameStatus, syncBoard]);

    useEffect(() => {
        if (turn === 'black' && gameStatus === 'playing') {
            makeBotMove();
        }
    }, [turn, gameStatus, makeBotMove]);

    const handleSquareClick = (r, c) => {
        if (turn !== 'white' || gameStatus !== 'playing') return;

        const idx = r * 8 + c;
        const piece = logic.board[idx];

        if (piece && piece.color === WHITE) {
            setSelected({ r, c });
            const moves = logic.getLegalMoves().filter(m => m.from === idx);
            setPossibleMoves(moves.map(m => `${Math.floor(m.to / 8)},${m.to % 8}`));
        } else if (selected) {
            const fromIdx = selected.r * 8 + selected.c;
            const toIdx = r * 8 + c;
            const move = logic.getLegalMoves().find(m => m.from === fromIdx && m.to === toIdx);

            if (move) {
                logic.makeMove(move);
                syncBoard();

                const state = logic.checkGameState();
                if (state === 'checkmate') {
                    setGameStatus('won');
                } else if (state === 'stalemate') {
                    setGameStatus('draw');
                }

                setSelected(null);
                setPossibleMoves([]);
            } else {
                setSelected(null);
                setPossibleMoves([]);
            }
        }
    };

    const resetGame = () => {
        logic.reset();
        syncBoard();
        setSelected(null);
        setPossibleMoves([]);
        setGameStatus('playing');
    };

    return (
        <div className="chess-container">
            <div className="chess-header">
                <div className="status">
                    {gameStatus === 'playing' ? (
                        <>Turn: <span className={turn}>{turn === 'white' ? 'You (White)' : 'Bot (Black)'}</span></>
                    ) : (
                        <span className={`game-over ${gameStatus}`}>
                            {gameStatus === 'won' ? 'You Won! 🏆' : gameStatus === 'lost' ? 'You Lost 💀' : 'Draw 🤝'}
                        </span>
                    )}
                </div>

                <div className="difficulty-selector">
                    <label>Difficulty:</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={gameStatus !== 'playing' && turn === 'black'}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
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
                                    {piece && <span className={`chess-piece ${piece === piece.toUpperCase() ? 'white' : 'black'}`}>{PIECES[piece]}</span>}
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
