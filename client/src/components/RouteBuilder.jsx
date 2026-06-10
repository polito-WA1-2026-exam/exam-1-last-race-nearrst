import { Button } from "react-bootstrap";

function RouteBuilder({
    segments,
    route,
    onSegmentClick,
    onUndo,
    startStation,
    destStation,
    disabled = false,
}) {

    // build station name lookup from segments
    const nameMap = {};
    for (const seg of segments) {
        nameMap[seg.from_id] = seg.from_name;
        nameMap[seg.to_id] = seg.to_name;
    }

    // build set of used segment keys for visual feedback
    const usedKeys = new Set();
    for (let i = 0; i < route.length - 1; i++) {
        const a = route[i], b = route[i + 1];
        usedKeys.add(a < b ? `${a}-${b}` : `${b}-${a}`);
    }

    const atDestination = route.length > 0 &&
    route[route.length - 1] === destStation.id;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/*  CURRENT ROUTE */}
            <div style={{
                background: '#16213e',
                border: '1px solid #2c3e50',
                borderRadius: 8,
                padding: 12,
                minHeight: 64,
            }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontSize: 12, color: '#95a5a6' }}>Your route</span>
                    {route.length > 0 && !disabled && (
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={onUndo}
                            style={{ fontSize: 11, padding: '2px 8px' }}
                        >
                            Undo
                        </Button>
                    )}
                </div>

                {route.length === 0 ? (
                    <div style={{ fontSize: 12, color: '#4a5568', fontStyle: 'italic' }}>
                        Click any segment below to build your route
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 4,
                    }}>
                        {route.map((stationId, i) => {
                            const name = nameMap[stationId] || `#${stationId}`;
                            const isStart = i === 0;
                            const isEnd = i === route.length - 1 && atDestination;

                            return (
                                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '3px 10px',
                                        borderRadius: 999,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        background: isStart ? '#27ae60' :
                                        isEnd ? '#f39c12' : '#2c3e50',
                                        color: isEnd   ? '#1a1a2e' : '#ecf0f1',
                                        border: '1px solid',
                                        borderColor:  isStart ? '#2ecc71' :
                                        isEnd ? '#e67e22' : '#34495e',
                                    }}>
                                        {name}
                                    </span>
                                    {i < route.length - 1 && (
                                        <span style={{ color: '#7f8c8d', fontSize: 12 }}>⇄</span>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                )}

                {atDestination && (
                    <div style={{ color: '#2ecc71', fontSize: 12, marginTop: 6 }}>
                        ✓ Route reaches the destination!
                    </div>
                )}
            </div>

            {/* SEGMENT PILLS */}

            <div style={{
                maxHeight: '340px',
                overflowY: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                padding: 4,
            }}>
                {segments.map((seg, i) => {
                    const key  = seg.from_id < seg.to_id
                    ? `${seg.from_id}-${seg.to_id}`
                    : `${seg.to_id}-${seg.from_id}`;
                    const used = usedKeys.has(key);

                    return (
                        <button
                            key={i}
                            onClick={() => !disabled && onSegmentClick(seg)}
                            disabled={disabled}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '5px 12px',
                                borderRadius: 999,
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: disabled ? 'default' : 'pointer',
                                border: '1px solid',
                                background: used ? '#1a3a2a' : '#1e2a3a',
                                borderColor: used ? '#27ae60' : '#2c3e50',
                                color: used ? '#2ecc71' : '#bdc3c7',
                                transition: 'all 0.15s',
                            }}
                        >
                            <span>{seg.from_name}</span>
                            <span style={{ color: '#7f8c8d' }}>⇄</span>
                            <span>{seg.to_name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default RouteBuilder;