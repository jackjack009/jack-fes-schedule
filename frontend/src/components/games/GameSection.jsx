import { useState } from 'react';
import TicTacToe from './TicTacToe';
import Game2048 from './Game2048';
import ChessGame from './ChessGame';
import FlappyBird from './FlappyBird';
import './GameSection.css';

const GameSection = () => {
    const [activeTab, setActiveTab] = useState('tictactoe');

    return (
        <div className="game-section">
            <div className="game-tabs">
                <button
                    className={`game-tab ${activeTab === 'tictactoe' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tictactoe')}
                >
                    ⭕ Tic Tac Toe
                </button>
                <button
                    className={`game-tab ${activeTab === 'chess' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chess')}
                >
                    ♟️ Chess
                </button>
                <button
                    className={`game-tab ${activeTab === '2048' ? 'active' : ''}`}
                    onClick={() => setActiveTab('2048')}
                >
                    🔢 2048
                </button>
                <button
                    className={`game-tab ${activeTab === 'flappy' ? 'active' : ''}`}
                    onClick={() => setActiveTab('flappy')}
                >
                    🐦 Flappy Bird
                </button>
            </div>

            <div className="game-content">
                {activeTab === 'tictactoe' && <TicTacToe />}
                {activeTab === 'chess' && <ChessGame />}
                {activeTab === '2048' && <Game2048 />}
                {activeTab === 'flappy' && <FlappyBird />}
            </div>
        </div>
    );
};

export default GameSection;

