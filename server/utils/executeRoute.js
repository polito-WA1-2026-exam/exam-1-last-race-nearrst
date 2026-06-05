import { getAllEvents, insertGameSegment, updateGame } from "../dao.js";

// executes a validated route
// applies random events to each segment
export async function executeRoute(gameId, route) {
    const events = await getAllEvents();
    let coins = 20;
    const steps = [];

    for (let i = 0; i < route.length - 1; i++) {
        const fromId = route[i];
        const toId = route[i + 1];

        // pick a random event from the events table
        const event = events[Math.floor(Math.random() * events.length)];
        coins += event.effect;

        const stepOrder = i + 1;

        // record this segment in the DB
        await insertGameSegment(gameId, fromId, toId, event.id, coins, stepOrder);

        steps.push({
            step: stepOrder,
            fromId,
            toId,
            event: { description: event.description, effect: event.effect },
            coinsAfter: coins,
        });
    }

    // final score (cannot go below 0)
    const finalScore = Math.max(0, coins);
    await updateGame(gameId, 'completed', finalScore);

    return { steps, finalScore };
}