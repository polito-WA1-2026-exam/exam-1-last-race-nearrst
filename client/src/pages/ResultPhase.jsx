import { Container, Button, Card, Badge } from "react-bootstrap";

// ResultPhase shows the final score and lets the player start a new game
function ResultPhase({ result, startStation, destStation, onPlayAgain }) {

    const score = result.finalScore ?? result.score ?? 0;
    const isValid = result.valid;
    const steps = result.steps || [];

    const tier = score >= 24 ? 'legendary' :
    score >= 20 ? 'great' :
    score >= 15 ? 'decent' :
    score >   0 ? 'poor' : 'zero';

    const tierConfig = {
        legendary: { emoji: '👑', label: 'Legendary Run!', color: '#f39c12' },
        great: { emoji: '⭐', label: 'Great Journey!', color: '#2ecc71' },
        decent: { emoji: '🚇', label: 'Safe Arrival', color: '#3498db' },
        poor: { emoji: '😓', label: 'Rough Ride', color: '#e67e22' },
        zero: { emoji: '💀', label: 'Lost Everything', color: '#e74c3c' },
    };

    const { emoji, label, color } = tierConfig[tier];

    return (
        <Container className="py-4">
            <div className="text-center mb-4">
                <div style={{ fontSize: 56, marginBottom: 8 }}>{emoji}</div>
                <h3 style={{ color, marginBottom: 4 }}>{label}</h3>
                <p style={{ color: '#95a5a6' }}>
                    {isValid
                    ? `You travelled from ${startStation.name} to ${destStation.name}`
                    : `Your route from ${startStation.name} to ${destStation.name} was invalid`
                    }
                </p>
            </div>

            {/* Score card */}
            <Card
                bg="dark"
                border="secondary"
                style={{ maxWidth: 320, margin: '0 auto 32px' }}
            >
                <Card.Body className="text-center p-4">
                    <div style={{ fontSize: 13, color: '#95a5a6', marginBottom: 8 }}>
                        Final Score
                    </div>
                    <div style={{
                        fontSize: 64,
                        fontWeight: 'bold',
                        color,
                        fontFamily: 'monospace',
                        lineHeight: 1,
                    }}>
                        {score}
                    </div>
                    <div style={{ fontSize: 13, color: '#7f8c8d', marginTop: 4 }}>
                        coins
                    </div>

                    {isValid && steps.length > 0 && (
                        <div style={{
                            marginTop: 16,
                            paddingTop: 16,
                            borderTop: '1px solid #2c3e50',
                            fontSize: 12,
                            color: '#95a5a6',
                        }}>
                            {steps.length} segment{steps.length !== 1 ? 's' : ''} travelled
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Action buttons */}
            <div className="d-flex justify-content-center gap-3">
                <Button variant="warning" size="lg" onClick={onPlayAgain}>
                    Play Again
                </Button>
                <Button
                    variant="outline-light"
                    size="lg"
                    as="a"
                    href="/leaderboard"
                >
                    Leaderboard
                </Button>
            </div>
        </Container>
    );
}

export default ResultPhase;