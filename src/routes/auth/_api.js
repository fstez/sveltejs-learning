const BASE_URL = process.env.API_BASE || 'https://js.kristjankivikangur21.thkit.ee/';

async function json(res) {
    try { return await res.json(); } catch { return null; }
}

async function request(method, endpoint, data) {
    const url = BASE_URL + endpoint.replace(/^\/+/, '');
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
    });

    const body = await json(res);
    if (!res.ok) {
        const message = (body && (body.error || body.message)) || `${res.status} ${res.statusText}`;
        throw new Error(message);
    }
    return body;
}

export const post = async (endpoint, data) => {
    if (endpoint === 'register' || endpoint === 'users') {
        return { user: { username: data.username || data.user?.username, token: 'fake' } };
    }
    if (endpoint === 'login' || endpoint === 'users/login') {
        return { user: { username: data.username || data.user?.email, token: 'fake' } };
    }
    return { ok: true };
};
export const get = (endpoint) => request('GET', endpoint);
