import * as api from 'api.js';
export function post(req, res) {
    api.get('transactions', req.session.username).then(r => {
        const list = Array.isArray(r) ? r : (r?.transactions || r?.items || []);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(list));
    });
}
