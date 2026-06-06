const BASE = '/api';

// generic request helper
async function request(method, path, body) {
    const options = {
        method,
        credentials: 'include',
        headers: {},
    };

    if (body !== undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE}${path}`, options);

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || 'Request failed');
    }

    if (res.status === 204)
        return null;

    return res.json();
}

// Auth
export const login = (username, password) => request('POST', '/sessions', { username, password });
export const logout = () => request('DELETE', '/sessions/current');
export const getCurrentUser = () => request('GET', '/sessions/current');

// Network
export const getFullNetwork = () => request('GET', '/network');
export const getStations = () => request('GET', '/network/stations');
export const getSegments = () => request('GET', '/network/segments');

// Games
export const createGame = () => request('POST', '/games');
export const getGame = (id) => request('GET', `/games/${id}`);
export const submitRoute = (id, route) => request('POST', `/games/${id}/route`, { route });
export const getGameSegments= (id) => request('GET', `/games/${id}/segments`);

// Leaderboard
export const getLeaderboard = () => request('GET', '/leaderboard');