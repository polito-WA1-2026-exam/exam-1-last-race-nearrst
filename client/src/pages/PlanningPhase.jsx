import { useState, useEffect, useCallback, useRef } from "react";
import { Container, Row, Col, Button, Alert, Spinner, Badge } from "react-bootstrap";
import NetworkMap from "../components/NetworkMap.jsx"
import CountdownTimer from "../components/CountdownTimer.jsx";
import RouteBuilder from "../components/RouteBuilder.jsx";
import { getFullNetwork, getSegments, submitRoute } from "../api.js";

function PlanningPhase({ gameId, startStation, destStation, onRouteSubmitted }) {
    const [networkData, setNetworkData] = useState(null);
    const [segments, setSegments] = useState([]);
    const [route, setRoute] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [timerExpired, setTimerExpired] = useState(false);
    const [error, setError] = useState('');

    const routeRef = useRef([]);
    const hasSubmitted = useRef(false);

    useEffect(() => {
        Promise.all([getFullNetwork(), getSegments()])
        .then(([network, segs]) => {
            setNetworkData(network);
            setSegments(segs.segments);
        })
        .catch(() => setError('Failed to load planning data.'))
        .finally(() => setLoading(false));
    }, []);

    const handleSubmit = useCallback(async (currentRoute) => {
        if (hasSubmitted.current)
            return;
        hasSubmitted.current = true;
        setSubmitting(true);
        setError('');

        try {
            if (!currentRoute || currentRoute.length < 2) {
                onRouteSubmitted({
                    valid: false,
                    reason: 'Route is incomplete.',
                    score: 0,
                    steps: [],
                });
                return;
            }
            const result = await submitRoute(gameId, currentRoute);
            onRouteSubmitted(result);
        } catch (err) {
            setError(err.message || 'Failed to submit route.');
            setSubmitting(false);
            hasSubmitted.current = false;
        }
    }, [gameId, onRouteSubmitted]);

    // Timer expiry: Auto-submit immediately
    const handleTimerExpire = useCallback(() => {
        setTimerExpired(true);
    }, []);

    useEffect(() => {
        if (timerExpired) {
            handleSubmit(routeRef.current);
        }
    }, [timerExpired, handleSubmit]);

    // clicking a segment pill adds it to the route
    const handleSegmentClick = (seg) => {
        setRoute(prev => {
            let next;
            if (prev.length === 0) {
                // first click
                next = [seg.from_id, seg.to_id];
            } else {
                const last = prev[prev.length - 1];
                if (seg.from_id === last) {
                    next = [...prev, seg.to_id];
                } else if (seg.to_id === last) {
                    next = [...prev, seg.from_id];
                } else {
                    // segment doesn't connect to last station
                    next = [...prev, seg.from_id, seg.to_id];
                }
            }
            routeRef.current = next;
            return next;
        });
    };

    const handleUndo = () => {
        setRoute(prev => {
        const next = prev.length <= 1 ? [] : prev.slice(0, -1);
        routeRef.current = next;
        return next;
        });
    };

    const selectedIds = new Set(route);

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="warning" />
                <div className="mt-2 text-muted">Preparing your journey...</div>
            </div>
        );
    }

    return (
        <Container fluid className="py-2">

            {/* Header */}
            <div className="text-center mb-3">
                <h5 style={{ color: '#ecf0f1' }}>
                    Plan your route from{' '}
                    <Badge bg="success" style={{ fontSize: 15 }}>{startStation.name}</Badge>
                    {' '}to{' '}
                    <Badge bg="warning" text="dark" style={{ fontSize: 15 }}>{destStation.name}</Badge>
                </h5>
                <div style={{ fontSize: 12, color: '#95a5a6' }}>
                    Lines are hidden. Reconstruct the network from memory
                </div>
            </div>

            {error && <Alert variant="danger" className="mb-2">{error}</Alert>}

            <Row className="g-3">

                {/* Left: timer + map + submit */}
                <Col md={7}>
                    <CountdownTimer
                        seconds={90}
                        onExpire={handleTimerExpire}
                        running={!submitting && !timerExpired}
                    />

                    <NetworkMap
                        networkData={networkData}
                        showLines={false}
                        selectedIds={selectedIds}
                        svgMaxWidth={480}
                    />

                    <div className="text-center mt-2">
                        <Button
                            variant="warning"
                            size="lg"
                            onClick={() => handleSubmit(routeRef.current)}
                            disabled={submitting || timerExpired}
                        >
                            {submitting
                            ? <><Spinner size="sm" className="me-2" />Submitting...</>
                            : 'Submit Route'
                            }
                        </Button>
                    </div>
                </Col>

                {/* Right: route builder */}
                <Col md={5}>
                    <RouteBuilder
                        segments={segments}
                        route={route}
                        onSegmentClick={handleSegmentClick}
                        onUndo={handleUndo}
                        startStation={startStation}
                        destStation={destStation}
                        disabled={timerExpired || submitting}
                    />
                </Col>

            </Row>
        </Container>
    );
}

export default PlanningPhase;