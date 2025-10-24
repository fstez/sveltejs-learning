// src/server.js
import polka from 'polka';
import compression from 'compression';
import sirv from 'sirv';
import * as sapper from '@sapper/server';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka()
	.use(
		bodyParser.json(),
		cookieSession({
			name: 'sess',
			keys: ['replace-with-strong-secret'],
			maxAge: 7 * 24 * 60 * 60 * 1000
		}),
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req) => ({
				user: req.session?.user,
				token: req.session?.token
			})
		})
	)
	.listen(PORT || 3000, err => {
		if (err) console.log('error', err);
	});
