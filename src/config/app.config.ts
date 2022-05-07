import 'dotenv/config';
import env from '../config/env.config';
import express, { Application } from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import { registerCommonRoutes } from '../common/routes/common.routes';
import {
	handleErrors,
	handleInvalidUrl,
} from '../common/middleware/error.middleware';
import { registerListRoutes } from '../list/routes/list.routes';
import { registerListItemRoutes } from '../listItem/routes/listItem.routes';
import { registerUserRoutes } from '../user/routes/user.routes';

// TODO - Add database connection and stop processes here

export class App {
	public app: Application;
	public server: Server;
	public port: number;

	constructor() {
		this.app = express();
		this.server = new Server();
		this.port = env.PORT;
	}

	public async initialiseLoggers() {
		Sentry.init({
			dsn: env.SENTRY_URL,
			tracesSampleRate: 1.0,
		});

		this.server.on('error', (error) => {
			Sentry.captureException(error);
		});
		console.log('Loggers initialised...');
	}

	public async registerParsers() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(cors());
		this.app.use(helmet());
		console.log('Parsers registered...');
	}

	public async registerRoutes() {
		registerCommonRoutes(this.app);
		registerListRoutes(this.app);
		registerListItemRoutes(this.app);
		registerUserRoutes(this.app);
		console.log('Routes registered...');
	}

	public async registerMiddleware() {
		this.app.use(handleInvalidUrl);
		this.app.use(handleErrors);
		console.log('Middleware registered...');
	}

	public async start() {
		return new Promise<void>((resolve) => {
			this.server = this.app.listen(this.port, resolve);
			console.log(`Server listening on port ${this.port}...`);
			console.log(`Environment - ${env.NODE_ENV}`);
		});
	}

	public async stop() {
		return new Promise<void>((resolve, reject) => {
			this.server.close((error) => {
				if (error) {
					return reject(error);
				}
				resolve();
			});
		});
	}
}
