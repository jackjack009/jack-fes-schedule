import './FlappyBird.css';

const FlappyBird = () => {
    return (
        <div className="flappy-container">
            <div className="flappy-iframe-wrapper">
                <iframe
                    src="https://flappybird.io/"
                    title="Flappy Bird Game"
                    className="flappy-iframe"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>
            <p className="flappy-instructions">
                Click or tap to make the bird flap!
            </p>
        </div>
    );
};

export default FlappyBird;
