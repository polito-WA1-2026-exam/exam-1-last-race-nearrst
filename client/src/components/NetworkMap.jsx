import { STATION_POSITIONS } from "../config/networkLayout.js";

// NetworkMap renders an SVG of the Valdermoor underground network
function NetworkMap({
    networkData,
    showLines = true,
    selectedIds = new Set(),
    svgMaxWidth = 760,
    routeStations = [],
    completedSegments = [],
    currentSegment = null,
    neutralLines = false
}) {

    if (!networkData) {
        return (
            <div className="text-center text-muted p-4">
                Loading map...
            </div>
        );
    }

    const { lines } = networkData;

    // build a flat list of all stations with no duplicates
    const stationsMap = {};
    for (const line of lines) {
        for (const station of line.stations) {
            stationsMap[station.id] = station;
        }
    }
    const allStations = Object.values(stationsMap);

    return (
        <div>
            <svg
                viewBox="0 0 760 520"
                style={{
                    width: '100%',
                    maxWidth: `${svgMaxWidth}px`,
                    display: 'block',
                    margin: '0 auto'
                }}
            >
                {/* LINE LAYER */}
                {showLines && lines.map(line => {
                    const sorted = [...line.stations].sort((a, b) => a.position - b.position);
                    const points = sorted.map(s => {
                        const pos = STATION_POSITIONS[s.id];
                        return pos ? `${pos.x},${pos.y}` : null;
                    }).filter(Boolean).join(' ');
                    
                    return(
                        <polyline
                            key={line.id}
                            points={points}
                            stroke={neutralLines ? '#2c3e50' : line.color}
                            strokeWidth={6}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={0.8}
                            opacity={neutralLines ? 1 : 0.8}
                        />
                    );
                })}

                {/* EXECUTION COMPLETED SEGMENTS LAYER */}
                {completedSegments.map(([fromId, toId], i) => {
                    const fromPos = STATION_POSITIONS[fromId];
                    const toPos = STATION_POSITIONS[toId];
                    if (!fromPos || !toPos)
                        return null;
                    return (
                        <line
                            key={`completed-${i}`}
                            x1={fromPos.x} y1={fromPos.y}
                            x2={toPos.x}   y2={toPos.y}
                            stroke="#f39c12"
                            strokeWidth={5}
                            strokeLinecap="round"
                            opacity={0.6}
                        />
                    );
                })}

                {/* EXECUTION CURRENT SEGMENT LAYER */}
                {currentSegment && (() => {
                    const fromPos = STATION_POSITIONS[currentSegment[0]];
                    const toPos = STATION_POSITIONS[currentSegment[1]];
                    if (!fromPos || !toPos)
                        return null;
                    return (
                        <line
                            x1={fromPos.x}
                            y1={fromPos.y}
                            x2={toPos.x}
                            y2={toPos.y}
                            stroke="#ffffff"
                            strokeWidth={7}
                            strokeLinecap="round"
                            opacity={0.9}
                        />
                    );
                })()}

                {/* EXECUTION STATION HIGHLIGHTS */}
                {currentSegment && currentSegment.map((stationId, i) => {
                    const pos = STATION_POSITIONS[stationId];
                    if (!pos)
                        return null;
                    return (
                        <circle
                            key={`highlight-${i}`}
                            cx={pos.x}
                            cy={pos.y}
                            r={14}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth={3}
                            opacity={0.9}
                        />
                    );
                })}

                {/* STATION LAYER */}
                {allStations.map(station => {
                    const pos = STATION_POSITIONS[station.id];
                    if (!pos)
                        return null;

                    const isSelected = selectedIds.has(station.id);
                    const servingLines = lines.filter(l =>
                        l.stations.some(s => s.id === station.id)
                    );
                    const isInterchange = servingLines.length > 1;

                    return(
                        <g key={station.id}>
                            {isInterchange && showLines && (
                                <circle
                                    cx={pos.x} cy={pos.y} r={14}
                                    fill="none" stroke="#ffffff"
                                    strokeWidth={2} opacity={0.6}
                                />
                            )}
                            <circle
                                cx={pos.x} cy={pos.y}
                                r={isSelected ? 10 : 8}
                                fill={isSelected ? '#f39c12' : (showLines ? '#ffffff' : '#95a5a6')}
                                stroke={isSelected ? '#e67e22' : '#2c3e50'}
                                strokeWidth={2}
                            />
                            <text
                                x={pos.x} y={pos.y + 24}
                                textAnchor="middle"
                                fontSize={showLines ? 11 : 12}
                                fill={isSelected ? '#f39c12' : '#ecf0f1'}
                                fontFamily="sans-serif"
                                fontWeight={isSelected ? 'bold' : 'normal'}
                            >
                                {station.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default NetworkMap;