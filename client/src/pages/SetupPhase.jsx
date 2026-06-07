import { useState, useEffect } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import NetworkMap from "../components/NetworkMap.jsx";
import { getFullNetwork, createGame } from "../api.js";

function SetupPhase({ onGameReady }) {
    const [networkData, setNetworkData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getFullNetwork().then(data => setNetworkData(data)).catch(() =>
            setError('Failed to load the network map. Please try again.')).finally(() =>
            setLoading(false));
    }, []);

   const handleReady = async () => {
    setStarting(true);
    setError('');
    try {
        const game = await createGame();
        onGameReady(game.gameId, game.startStation, game.destStation);
    } catch (err) {
        setError('Failed to start the game. Please try again.');
        setStarting(false);
    }
   };

   if (loading) {
    return (
        <div className="text-center p-5">
            <Spinner animation="border" variant="warning" />
            <div className="mt-2 text-muted">Loading network map...</div>
        </div>
    );
   }

   return (
    <Container>
        <div className="text-center mb-3">
            <h4 style={{ color: '#f39c12' }}>The Valdermoor Underground</h4>
            <p className="text-muted">
                Study the network carefully.In the next phase, the lines will be hidden.
            </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <NetworkMap networkData={networkData} showLines={true} />

        <div className="text-center mt-4">
            <Button
                variant="warning"
                size="lg"
                onClick={handleReady}
                disabled={starting || !networkData}
            >
                {starting ? (
                    <><Spinner size="sm" className="me-2" />Starting game...</>
                ) : (
                    "I've memorised the map. Ready to Play!"
                )}
            </Button>
        </div>
    </Container>
   );
}

export default SetupPhase;