import { useState } from "react";
import { Container } from "react-bootstrap";
import SetupPhase from "./SetupPhase.jsx";
import PlanningPhase from "./PlanningPhase.jsx";

function GamePage() {
    const [phase, setPhase] = useState('setup');
    const [gameId, setGameId] = useState(null);
    const [startStation, setStartStation] = useState(null);
    const [destStation, setDestStation] = useState(null);
    const [routeResult,  setRouteResult] = useState(null);

    const handleGameReady = (id, start, dest) => {
        setGameId(id);
        setStartStation(start);
        setDestStation(dest);
        setPhase('planning');
    };

    const handleRouteSubmitted = (result) => {
        setRouteResult(result);
        setPhase('execution');
    };

    return (
        <Container className="py-3">
            {phase === 'setup' && (
                <SetupPhase onGameReady={handleGameReady} />
            )}

            {phase === 'planning' && (
                <PlanningPhase
                    gameId={gameId}
                    startStation={startStation}
                    destStation={destStation}
                    onRouteSubmitted={handleRouteSubmitted}
                />
            )}

            {phase === 'execution' && (
                <div className="text-center text-warning p-5">
                    <h4>Execution phase...</h4>
                    <pre className="text-start text-muted mt-3" style={{ fontSize: 12 }}>
                        {JSON.stringify(routeResult, null, 2)}
                    </pre>
                </div>
            )}
        </Container>
    );
}

export default GamePage;