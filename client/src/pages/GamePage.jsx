import { useState } from "react";
import { Container } from "react-bootstrap";
import SetupPhase from "./SetupPhase.jsx";

function GamePage() {
    const [phase, setPhase] = useState('setup');
    const [gameId, setGameId] = useState(null);
    const [startStation, setStartStation] = useState(null);
    const [destStation, setDestStation] = useState(null);

    const handleGameReady = (id, start, dest) => {
        setGameId(id);
        setStartStation(start);
        setDestStation(dest);
        setPhase('planning');
    };

    return (
        <Container className="py-3">
            {phase === 'setup' && (
                <SetupPhase onGameReady={handleGameReady} />
            )}
            {phase === 'planning' && (
                <div className="text-center text-warning p-5">
                    <h4>Planning phase...</h4>
                    <p className="text-muted">
                        Game {gameId} — {startStation?.name} → {destStation?.name}
                    </p>
                </div>
            )}
        </Container>
    );
}

export default GamePage;