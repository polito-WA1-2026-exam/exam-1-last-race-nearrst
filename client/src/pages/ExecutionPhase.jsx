import { useState } from "react";
import { Container, Button, Badge, Card } from "react-bootstrap";

function ExecutionPhase({ result, startStation, destStation, onFinished }) {

    const [currentStep, setCurrentStep] = useState(0);

    // invalid or incomplete route
    // skip execution entirely
    if (!result.valid) {
        return (
            <Container className="py-4">
                <div className="text-center">
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                    <h4 style={{ color: '#e74c3c' }}>Route Invalid</h4>
                    <p style={{ color: '#95a5a6', maxWidth: 400, margin: '0 auto 24px' }}>
                        {result.reason || 'Your route was invalid or incomplete.'}
                    </p>

                    <Card bg="dark" border="danger" style={{ maxWidth: 320, margin: '0 auto 24px' }}>
                        <Card.Body className="text-center">
                            <div style={{ fontSize: 13, color: '#95a5a6', marginBottom: 4 }}>
                                Final Score
                            </div>
                            <div style={{
                                fontSize: 48,
                                fontWeight: 'bold',
                                color: '#e74c3c',
                            }}>
                                0
                            </div>
                            <div style={{ fontSize: 12, color: '#7f8c8d' }}>coins</div>
                        </Card.Body>
                    </Card>

                    <Button variant="outline-warning" size="lg" onClick={onFinished}>
                        See Results
                    </Button>
                </div>
            </Container>
        );
    }

    // valid route
    // show steps
    const steps = result.steps || [];
    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;
    const progress = currentStep + 1;

    // coin effect color
    const effectColor = step.event.effect > 0 ? '#2ecc71' : step.event.effect < 0 ? '#e74c3c' : '#95a5a6';
    const effectSign  = step.event.effect > 0 ? '+' : '';

    return (
        <Container className="py-4">
            <div className="text-center mb-4">
                <h5 style={{ color: '#ecf0f1' }}>
                    Travelling from{' '}
                    <Badge bg="success">{startStation.name}</Badge>
                    {' '}to{' '}
                    <Badge bg="warning" text="dark">{destStation.name}</Badge>
                </h5>
                <div style={{ fontSize: 12, color: '#95a5a6' }}>
                    Step {progress} of {steps.length}
                </div>
            </div>

            {/* Step card */}
            <Card
                bg="dark"
                border="secondary"
                style={{ maxWidth: 480, margin: '0 auto 24px' }}
            >
                <Card.Body className="p-4">

                    {/* Segment */}
                    <div className="text-center mb-3">
                        <span style={{
                            fontSize: 13,
                            color: '#95a5a6',
                            display: 'block',
                            marginBottom: 6,
                        }}>
                            Travelling
                        </span>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <Badge bg="secondary" style={{ fontSize: 13 }}>
                                {step.fromName || `Station ${step.fromId}`}
                            </Badge>
                            <span style={{ color: '#7f8c8d' }}>→</span>
                            <Badge bg="secondary" style={{ fontSize: 13 }}>
                                {step.toName || `Station ${step.toId}`}
                            </Badge>
                        </div>
                    </div>

                    <hr style={{ borderColor: '#2c3e50' }} />

                    {/* Event */}
                    <div className="text-center mb-3">
                        <span style={{
                            fontSize: 12,
                            color: '#95a5a6',
                            display: 'block',
                            marginBottom: 8,
                        }}>
                            What happened
                        </span>
                        <div style={{
                            fontSize: 15,
                            color: '#ecf0f1',
                            fontStyle: 'italic',
                            lineHeight: 1.5,
                        }}>
                            "{step.event.description}"
                        </div>
                        <div style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            color: effectColor,
                            marginTop: 8,
                        }}>
                            {effectSign}{step.event.effect} coins
                        </div>
                    </div>

                    <hr style={{ borderColor: '#2c3e50' }} />

                    {/* Running total */}
                    <div className="text-center">
                        <span style={{ fontSize: 12, color: '#95a5a6' }}>
                            Coins after this step
                        </span>
                        <div style={{
                            fontSize: 36,
                            fontWeight: 'bold',
                            color: step.coinsAfter >= 0 ? '#f39c12' : '#e74c3c',
                            fontFamily: 'monospace',
                        }}>
                            {step.coinsAfter}
                        </div>
                    </div>

                </Card.Body>
            </Card>

            {/* Step progress dots */}
            <div className="d-flex justify-content-center gap-2 mb-4">
                {steps.map((_, i) => (
                    <div key={i} style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: i < progress ? '#f39c12' : '#2c3e50',
                        transition: 'background 0.3s',
                    }} />
                ))}
            </div>

            {/* Next / Finish button */}
            <div className="text-center">
                <Button
                    variant="outline-warning"
                    size="lg"
                    onClick={() => {
                        if (isLast) {
                            onFinished();
                        } else {
                            setCurrentStep(prev => prev + 1);
                        }
                    }}
                >
                    {isLast ? 'See Final Score →' : 'Next Step →'}
                </Button>
            </div>
        </Container>
    );
}

export default ExecutionPhase;