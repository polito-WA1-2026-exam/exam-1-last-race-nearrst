import { Link } from "react-router-dom";
import { Container, Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";

function Home() {
    const { user } = useAuth();

    return (
        <Container className="py-4" style={{ maxWidth: 760 }}>

            {/* Hero */}
            <div className="text-center mb-4">
                <h2 style={{ color: '#f39c12' }}>Valdermoor Underground</h2>
                <p style={{ color: '#95a5a6', maxWidth: 500, margin: '0 auto' }}>
                    Navigate the ancient tunnels beneath the city of Valdermoor.
                    Plan your route, beat the clock, and collect as many coins as possible.
                </p>
                {user ? (
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        <Button as={Link} to="/game" variant="outline-warning" size="lg">
                            Start Game
                        </Button>
                    </div>
                ) : (
                    <Button as={Link} to="/login" variant="outline-warning" size="lg" className="mt-3">
                        Login to Play
                    </Button>
                )}
            </div>

            {/* How to play */}
            <Card bg="dark" border="secondary" className="mb-3">
                <Card.Body className="p-4">
                    <Card.Title style={{ color: '#f39c12' }}>How to Play</Card.Title>
                    <Row className="g-3 mt-1">

                        <Col md={6}>
                            <div className="d-flex gap-3">
                                <div>
                                    <div style={{ color: '#ecf0f1', fontWeight: 500 }}>
                                        Setup
                                    </div>
                                    <div style={{ color: '#95a5a6', fontSize: 13 }}>
                                        Study the full network map with all lines and connections.
                                        Memorise it! The lines disappear in the next phase.
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className="d-flex gap-3">
                                <div>
                                    <div style={{ color: '#ecf0f1', fontWeight: 500 }}>
                                        Planning{' '}
                                        <Badge bg="light" style={{ fontSize: 10, color: '#95a5a6' }}>90s</Badge>
                                    </div>
                                    <div style={{ color: '#95a5a6', fontSize: 13 }}>
                                        You're assigned a start and destination. Build your route
                                        from the segment list before time runs out.
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className="d-flex gap-3">
                                <div>
                                    <div style={{ color: '#ecf0f1', fontWeight: 500 }}>
                                        Execution
                                    </div>
                                    <div style={{ color: '#95a5a6', fontSize: 13 }}>
                                        Your route is validated. Each segment brings a random event;
                                        gaining or losing coins along the way.
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className="d-flex gap-3">
                                <div>
                                    <div style={{ color: '#ecf0f1', fontWeight: 500 }}>
                                        Result
                                    </div>
                                    <div style={{ color: '#95a5a6', fontSize: 13 }}>
                                        Your final coin count is your score. Reach the destination
                                        with as many coins as possible. Best scores go on the
                                        leaderboard.
                                    </div>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </Card.Body>
            </Card>

            {/* Coin events info */}
            <Card bg="dark" border="secondary" className="mb-3">
                <Card.Body className="p-4">
                    <Card.Title style={{ color: '#f39c12' }}>Coins</Card.Title>
                    <div style={{ fontSize: 13, color: '#95a5a6' }}>
                        Every game starts with 20 coins.
                        Each segment you travel triggers a random event; effects range
                        from -4 to{' '}
                        +4 coins.
                        An invalid or incomplete route costs you all 20 coins.
                        Final score cannot go below zero.
                    </div>
                </Card.Body>
            </Card>

        </Container>
    );
}

export default Home;