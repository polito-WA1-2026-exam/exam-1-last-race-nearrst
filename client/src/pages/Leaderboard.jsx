import { useState, useEffect } from "react";
import { Container, Table, Spinner, Alert, Badge } from "react-bootstrap";
import { getLeaderboard } from "../api.js";

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getLeaderboard()
        .then(data => setLeaderboard(data.leaderboard))
        .catch(() => setError('Failed to load leaderboard.'))
        .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="warning" />
                <div className="mt-2 text-muted">Loading rankings...</div>
            </div>
        );
    }

    return (
        <Container className="py-4" style={{ maxWidth: 600 }}>

            <div className="text-center mb-4">
                <h3 style={{ color: '#f39c12' }}>Hall of Champions</h3>
                <div style={{ fontSize: 13, color: '#95a5a6' }}>
                    Valdermoor Underground: All time best scores
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {leaderboard.length === 0 && !error ? (
                <div className="text-center text-muted fst-italic">
                    No completed games yet. Be the first to finish!
                </div>
            ) : (
                <Table
                    variant="dark"
                    hover
                    style={{ borderColor: '#2c3e50' }}
                >
                    <thead>
                        <tr style={{ color: '#95a5a6', fontSize: 13 }}>
                            <th style={{ textAlign: 'center' }}>Rank</th>
                            <th style={{ textAlign: 'center' }}>Explorer</th>
                            <th style={{ textAlign: 'center' }}>Best Score</th>
                            <th style={{ textAlign: 'center' }}>Games</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((entry) => (
                            <tr key={entry.rank} style={{ fontSize: 15 }}>
                                <td style={{ textAlign: 'center' }}>
                                    {entry.rank}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span style={{ color: '#ecf0f1', fontWeight: 500 }}>
                                        {entry.username}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span style={{ color: '#ecf0f1', fontWeight: 500 }}>
                                        {entry.bestScore}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center', color: '#7f8c8d' }}>
                                    {entry.gamesPlayed}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

        </Container>
    );
}

export default Leaderboard;