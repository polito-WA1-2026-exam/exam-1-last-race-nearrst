import { Link } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";

function Home() {
    const { user } = useAuth();

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card bg="dark" text="light" border="secondary" className="mb-4">
                        <Card.Body className="p-4">
                            <Card.Title className="display-6 mb-3">
                                Welcome to Valdermoor Underground
                            </Card.Title>
                            <Card.Text>
                                Deep beneath the ancient city of Valdermoor, a network of tunnels
                                connects its many districts. You have been assigned a starting station
                                and a destination. Find your way through the underground before time
                                runs out.
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card bg="dark" text="light" border="secondary" className="mb-4">
                        <Card.Body className="p-4">
                            <Card.Title className="h5 mb-3">How to Play</Card.Title>
                            <ol className="ps-3">
                                <li className="mb-2">
                                    <strong>Setup:</strong> Study the full network map, memorise
                                    the lines and connections.
                                </li>
                                <li className="mb-2">
                                    <strong>Planning:</strong> You have 90 seconds. The map now
                                    shows only station names. Build your route by selecting segments
                                    from the list.
                                </li>
                                <li className="mb-2">
                                    <strong>Execution:</strong> Your route is validated and each
                                    segment brings a random event resulting in gaining or losing coins.
                                </li>
                                <li className="mb-2">
                                    <strong>Result:</strong> Your final coin count is your score.
                                    Reach the destination with as many coins as possible!
                                </li>
                            </ol>

                            {!user && (
                                <div className="mt-3 text-muted fst-italic">
                                    Login to access the network map and start playing.
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {user ? (
                        <div className="d-flex gap-3">
                            <Button as={Link} to="/game" variant="warning" size="lg">
                                Play Now
                            </Button>
                            <Button as={Link} to="/leaderboard" variant="outline-light" size="lg">
                                Leaderboard
                            </Button>
                        </div>
                    ) : (
                        <Button as={Link} to="/login" variant="warning" size="lg">
                            Login to Play
                        </Button>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Home;