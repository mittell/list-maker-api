import 'dotenv/config';
import config from './config/env.config';
import app from './config/app.config';

import * as http from 'http';
import * as Sentry from '@sentry/node';
// import * as Tracing from '@sentry/tracing';

Sentry.init({
	dsn: config.SENTRY_URL,
	tracesSampleRate: 1.0,
});

const server: http.Server = http.createServer(app);
const port = config.PORT;

// try {
// } catch (e) {
// 	Sentry.captureException(e);
// }

export default server.listen(port, () => {
	console.log(`Server listening on port ${port}...`);
	console.log(`Environment - ${config.NODE_ENV}`);
});
