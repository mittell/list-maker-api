import 'dotenv/config';
import config from './config/env.config';
import app from './config/app.config';

import * as http from 'http';
import * as Sentry from '@sentry/node';

Sentry.init({
	dsn: config.SENTRY_URL,
	tracesSampleRate: 1.0,
});

const server: http.Server = http.createServer(app);
const port = config.PORT;

server.on('error', (error) => {
	Sentry.captureException(error);
});

export default server.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
	console.log(`Environment - ${config.NODE_ENV}`);
});
