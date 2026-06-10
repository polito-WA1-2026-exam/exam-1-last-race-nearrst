import { useState, useEffect } from "react";
import { Container, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
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
    <Container fluid className="py-2">
        <Row className="align-items-start g-3">
            
            {/* Left: map */}
            <Col md={9}>
                <div className="text-center mb-2">
                    <h5 style={{ color: '#f39c12' }}>The Valdermoor Underground</h5>
                    <div style={{ fontSize: 12, color: '#95a5a6' }}>
                        Study the network carefully. In the next phase, the lines will be hidden.
                    </div>
                </div>
                <NetworkMap
                    networkData={networkData}
                    showLines={true}
                    svgMaxWidth={620}
                />
            </Col>

            {/* Right: legend + button */}
            <Col md={3} className="d-flex flex-column gap-3" style={{ paddingTop: 60 }}>
                
                {/* Line legend */}
                {networkData && (
                    <div className="d-flex flex-column gap-2">
                        <div style={{ fontSize: 12, color: '#95a5a6', marginBottom: 4 }}>
                            Lines
                        </div>
                        {networkData.lines.map(line => (
                            <div key={line.id} className="d-flex align-items-center gap-2">
                                <div style={{
                                    width: 28,
                                    height: 6,
                                    backgroundColor: line.color,
                                    borderRadius: 3,
                                    flexShrink: 0,
                                }} />
                                <span style={{ fontSize: 13, color: '#ecf0f1' }}>
                                    {line.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <hr style={{ borderColor: '#2c3e50', margin: '4px 0' }} />

                <Button
                    variant="outline-warning"
                    onClick={handleReady}
                    disabled={starting || !networkData}
                >
                    {starting ? (
                        <><Spinner size="sm" className="me-2" />Starting...</>
                    ) : (
                        <>Ready to Play</>
                    )}
                </Button>
            </Col>
        </Row>        
    </Container>
   );
}

export default SetupPhase;