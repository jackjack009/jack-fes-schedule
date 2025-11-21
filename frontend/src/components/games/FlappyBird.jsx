import { useState, useEffect, useRef, useCallback } from 'react';
import './FlappyBird.css';

const FlappyBird = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [birdY, setBirdY] = useState(250);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState([]);

    const gameRef = useRef(null);
    const animationRef = useRef(null);
    const lastTimeRef = useRef(0);
    const scoreRef = useRef(0);

    const BIRD_SIZE = 34;
    const PIPE_WIDTH = 52;
    const PIPE_GAP = 180; // Increased from 150 for easier gameplay
    const GRAVITY = 0.5; // Increased for more responsive feel
    const JUMP_STRENGTH = -8.5; // Increased for stronger jumps
    const PIPE_SPEED = 2.5; // Increased for faster gameplay on mobile
    const GAME_WIDTH = 400;
    const GAME_HEIGHT = 600;

    const jump = useCallback(() => {
        if (!gameStarted) {
            setGameStarted(true);
            setGameOver(false);
            setScore(0);
            scoreRef.current = 0;
            setBirdY(250);
            setBirdVelocity(JUMP_STRENGTH);
            setPipes([]);
        } else if (!gameOver) {
            setBirdVelocity(JUMP_STRENGTH);
        }
    }, [gameStarted, gameOver]);

    const resetGame = () => {
        setGameStarted(false);
        setGameOver(false);
        setScore(0);
        scoreRef.current = 0;
        setBirdY(250);
        setBirdVelocity(0);
        setPipes([]);
    };

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const gameLoop = (currentTime) => {
            const deltaTime = currentTime - lastTimeRef.current;

            if (deltaTime > 16) {
                lastTimeRef.current = currentTime;

                // Update bird position
                setBirdVelocity(prev => {
                    const newVelocity = prev + GRAVITY;
                    return newVelocity;
                });

                setBirdY(prev => {
                    const newY = prev + birdVelocity;

                    // Check ground/ceiling collision
                    if (newY <= 0 || newY >= GAME_HEIGHT - 100 - BIRD_SIZE) {
                        setGameOver(true);
                        if (scoreRef.current > highScore) {
                            setHighScore(scoreRef.current);
                        }
                        return prev;
                    }

                    return newY;
                });

                // Update pipes
                setPipes(prev => {
                    let newPipes = prev.map(pipe => ({
                        ...pipe,
                        x: pipe.x - PIPE_SPEED
                    }));

                    // Check for scoring
                    const birdX = 50;
                    newPipes.forEach(pipe => {
                        if (!pipe.scored && pipe.x + PIPE_WIDTH < birdX) {
                            pipe.scored = true;
                            scoreRef.current += 1;
                            setScore(scoreRef.current);
                        }
                    });

                    // Remove off-screen pipes
                    newPipes = newPipes.filter(pipe => pipe.x + PIPE_WIDTH > -10);

                    // Add new pipes
                    if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
                        const gapY = Math.random() * (GAME_HEIGHT - 100 - PIPE_GAP - 150) + 75;
                        newPipes.push({
                            x: GAME_WIDTH,
                            gapY: gapY,
                            scored: false
                        });
                    }

                    return newPipes;
                });

                // Check pipe collision
                const birdX = 50;
                const birdLeft = birdX;
                const birdRight = birdX + BIRD_SIZE;
                const birdTop = birdY;
                const birdBottom = birdY + BIRD_SIZE;

                pipes.forEach(pipe => {
                    const pipeLeft = pipe.x;
                    const pipeRight = pipe.x + PIPE_WIDTH;

                    if (birdRight > pipeLeft && birdLeft < pipeRight) {
                        if (birdTop < pipe.gapY || birdBottom > pipe.gapY + PIPE_GAP) {
                            setGameOver(true);
                            if (scoreRef.current > highScore) {
                                setHighScore(scoreRef.current);
                            }
                        }
                    }
                });
            }

            animationRef.current = requestAnimationFrame(gameLoop);
        };

        animationRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [gameStarted, gameOver, birdVelocity, birdY, pipes, highScore]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [jump]);

    // Touch/Click controls
    const handleClick = (e) => {
        e.preventDefault();
        jump();
    };

    return (
        <div className="flappy-container">
            <div
                ref={gameRef}
                className="flappy-game"
                onClick={handleClick}
                onTouchStart={handleClick}
            >
                {/* Sky background */}
                <div className="flappy-sky"></div>

                {/* Clouds */}
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>

                {/* City background */}
                <div className="city-bg"></div>

                {/* Score display during game */}
                {gameStarted && !gameOver && (
                    <div className="score-display">{score}</div>
                )}

                {/* Bird */}
                <div
                    className="bird"
                    style={{
                        top: `${birdY}px`,
                        left: '50px',
                        transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -20), 90)}deg)`
                    }}
                ></div>

                {/* Pipes */}
                {pipes.map((pipe, index) => (
                    <div key={index}>
                        {/* Top pipe */}
                        <div
                            className="pipe pipe-top"
                            style={{
                                left: `${pipe.x}px`,
                                height: `${pipe.gapY}px`
                            }}
                        >
                            <div className="pipe-cap"></div>
                        </div>
                        {/* Bottom pipe */}
                        <div
                            className="pipe pipe-bottom"
                            style={{
                                left: `${pipe.x}px`,
                                top: `${pipe.gapY + PIPE_GAP}px`,
                                height: `${GAME_HEIGHT - 100 - pipe.gapY - PIPE_GAP}px`
                            }}
                        >
                            <div className="pipe-cap"></div>
                        </div>
                    </div>
                ))}

                {/* Start screen */}
                {!gameStarted && (
                    <div className="flappy-overlay">
                        <div className="flappy-message">
                            <div className="game-over-text">FLAPPY BIRD</div>
                            <div className="score-board">
                                <div className="score-row">
                                    <span className="score-label">HIGH SCORE</span>
                                    <span className="score-value">{highScore}</span>
                                </div>
                            </div>
                            <button className="play-button" onClick={handleClick}>
                                PLAY
                            </button>
                            <p className="tap-hint">Tap to flap!</p>
                        </div>
                    </div>
                )}

                {/* Game over screen */}
                {gameOver && (
                    <div className="flappy-overlay">
                        <div className="flappy-message">
                            <div className="game-over-text">GAME OVER</div>
                            <div className="score-board">
                                <div className="score-row">
                                    <span className="score-label">SCORE</span>
                                    <span className="score-value">{score}</span>
                                </div>
                                <div className="score-row">
                                    <span className="score-label">HIGH SCORE</span>
                                    <span className="score-value">{highScore}</span>
                                </div>
                            </div>
                            <button className="play-button" onClick={resetGame}>
                                PLAY
                            </button>
                        </div>
                    </div>
                )}

                {/* Ground */}
                <div className="flappy-ground"></div>
            </div>
        </div>
    );
};

export default FlappyBird;
