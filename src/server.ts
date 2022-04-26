import 'dotenv/config';
import config from './config';
import express from 'express';
import app from './app/app';

import * as http from 'http';
import * as Sentry from '@sentry/node';
// import * as Tracing from '@sentry/tracing';

Sentry.init({
	dsn: config.SENTRY_URL,
	tracesSampleRate: 1.0,
});

const server: http.Server = http.createServer(app);
const port = config.PORT;

try {
	app.get('/', (_req: express.Request, res: express.Response) => {
		res.status(200).send('Hello World!');
	});
} catch (e) {
	console.log(`Error: ${e}`);
	Sentry.captureException(e);
}

export default server.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
	console.log(`Environment - ${config.NODE_ENV}`);
});
