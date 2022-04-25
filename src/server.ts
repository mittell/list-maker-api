import 'dotenv/config';
import config from './config';

import express from 'express';
import * as http from 'http';
import cors from 'cors';
import helmet from 'helmet';

import * as Sentry from '@sentry/node';
// import * as Tracing from '@sentry/tracing';

import { CommonRoutesConfig } from './common/common.routes.config';
import { ListRoutes } from './lists/lists.routes.config';

Sentry.init({
	dsn: config.SENTRY_URL,
	tracesSampleRate: 1.0,
});

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = config.PORT;

const routes: Array<CommonRoutesConfig> = [];

try {
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cors());
	app.use(helmet());

	routes.push(new ListRoutes(app));

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
	routes.forEach((route: CommonRoutesConfig) => {
		console.log(`Routes configured for ${route.getName()}`);
	});
});
