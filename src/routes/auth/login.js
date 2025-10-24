import * as api from 'api.js';

export async function post(req, res) {
    const { username, password } = req.body;

    const response = await api.post('sessions', { username, password });

    if (response.token) {
        // сохраняем токен
        req.session.token = response.token;

        // сохраняем пользователя в сессию
        req.session.user = { username };
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        user: req.session.user,
        token: req.session.token
    }));
}
