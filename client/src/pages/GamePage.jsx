import { useState } from "react";
import { Container } from "react-bootstrap";
import SetupPhase from "./SetupPhase.jsx";
import PlanningPhase from "./PlanningPhase.jsx";
import ExecutionPhase from "./ExecutionPhase.jsx";
import ResultPhase from "./ResultPhase.jsx";

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

    const handleExecutionFinished = () => {
        setPhase('result');
    };

    const handlePlayAgain = () => {
        setGameId(null);
        setStartStation(null);
        setDestStation(null);
        setRouteResult(null);
        setPhase('setup');
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
                <ExecutionPhase
                    result={routeResult}
                    startStation={startStation}
                    destStation={destStation}
                    onFinished={handleExecutionFinished}
                />
            )}

            {phase === 'result' && (
                <ResultPhase
                    result={routeResult}
                    startStation={startStation}
                    destStation={destStation}
                    onPlayAgain={handlePlayAgain}
                />
            )}
        </Container>
    );
}

export default GamePage;