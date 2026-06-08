import { useState, useEffect, useRef } from "react";
import { ProgressBar } from "react-bootstrap";

function CountdownTimer({ seconds = 90, onExpire, running = true }) {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
        if (!running)
            return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
            if (prev <= 1) {
                clearInterval(interval);
                return 0;
            }
            return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [running]);

    useEffect(() => {
        if (timeLeft === 0 && running) {
            onExpireRef.current?.();
        }
    }, [timeLeft, running]);

    const pct = (timeLeft / seconds) * 100;
    const variant = timeLeft > 30 ? 'success' : timeLeft > 10 ? 'warning' : 'danger';
    const mins = Math.floor(timeLeft / 60);
    const secs = String(timeLeft % 60).padStart(2, '0');

    return (
        <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted" style={{ fontSize: 13 }}>Time remaining</span>
                <span style={{
                    fontWeight: 'bold',
                    fontSize:   20,
                    color:      timeLeft <= 10 ? '#e74c3c' : '#f39c12',
                    fontFamily: 'monospace',
                }}>
                    {mins}:{secs}
                </span>
            </div>
            <ProgressBar now={pct} variant={variant} style={{ height: 8 }} />
        </div>
    );
}

export default CountdownTimer;