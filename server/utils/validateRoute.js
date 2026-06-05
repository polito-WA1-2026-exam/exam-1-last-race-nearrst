import { getSharedLines, getLinesForStation } from "../dao.js";

// validates a submitted route against the game rules
export async function validateRoute(route, startId, destId) {

    // rule 0: route must be an array with at least 2 stations
    if (!Array.isArray(route) || route.length < 2) {
        return { valid: false, reason: 'Route must contain at least 2 stations.' };
    }

    // rule 1: must start at the assigned start station
    if (route[0] !== startId) {
        return { valid: false, reason: 'Route does not start at the assigned station.' };
    }

    // rule 2: must end at the assigned destination
    if (route[route.length - 1] !== destId) {
        return { valid: false, reason: 'Route does not end at the destination station.' };
    }

    const firstStationLines = await getLinesForStation(route[0]);
    let currentLineIds = new Set(firstStationLines.map(r => r.line_id));

    for (let i = 0; i < route.length - 1; i++) {
        const fromId = route[i];
        const toId = route[i + 1];

        // rule 3: the segment must exist on at least one line
        const sharedLines = await getSharedLines(fromId, toId);

        if (sharedLines.length === 0) {
            return {
                valid: false,
                reason: `No direct connection exists between station ${fromId} and station ${toId}.`
            };
        }

        const sharedLineIds = new Set(sharedLines.map(r => r.line_id));

        // rule 4: line continuity
        const usableLines = [...sharedLineIds].filter(id => currentLineIds.has(id));

        if (usableLines.length === 0) {
            return {
                valid: false,
                reason: `Cannot travel from station ${fromId} to station ${toId} — invalid line change.`
            };
        }

        // update current lines for the next step
        const toStationLines = await getLinesForStation(toId);
        const toLineIds = new Set(toStationLines.map(r => r.line_id));

        if (toLineIds.size > 1) {
            // interchange station
            currentLineIds = toLineIds;
        } else {
            // non-interchange
            currentLineIds = new Set(usableLines);
        }
    }
    
    return { valid: true };
}