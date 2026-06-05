// builds a graph (adjacency map) from flat DB rows
function buildGraph(adjacencyRows) {
    const graph = new Map();

    for (const { station_id, neighbour_id } of adjacencyRows) {
        if (!graph.has(station_id))
            graph.set(station_id, new Set());
        if (!graph.has(neighbour_id))
            graph.set(neighbour_id, new Set());

        graph.get(station_id).add(neighbour_id);
        graph.get(neighbour_id).add(station_id);
    }
    return graph;
}

// BFS from a starting station
function bfs(graph, startId) {
    const distances = new Map();
    const queue = [startId];
    distances.set(startId, 0);

    while (queue.length > 0) {
        const current = queue.shift();
        const currentD = distances.get(current);

        for (const neighbour of (graph.get(current) || [])) {
            if (!distances.has(neighbour)) {
                distances.set(neighbour, currentD + 1);
                queue.push(neighbour);
            }
        }
    }

    return distances;
}

// returns all station IDs reachable with distance >= minDistance
export function getValidDestinations(adjacencyRows, startId, minDistance = 3) {
    const graph = buildGraph(adjacencyRows);
    const distances = bfs(graph, startId);
    const valid = [];

    for (const [stationId, distance] of distances) {
        if (stationId !== startId && distance >= minDistance)
            valid.push({ stationId, distance });
    }

    return valid;
}