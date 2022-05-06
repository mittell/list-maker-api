import 'dotenv/config';
import config from '../config/env.config';
import express, { Application } from 'express';
import { Server } from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';

// import { RoutesConfig } from '../common/types/routes.type';
// import { ListRoutes } from '../list/routes/list.routes';
// import { ListItemRoutes } from '../listItem/routes/listItem.routes';
// import { UserRoutes } from '../user/routes/user.routes';
// import { CommonRoutes } from '../common/routes/common.routes';
// import ErrorHandlerMiddleware from '../common/middleware/error.middleware';
// import ValidationMiddleware from '../common/middleware/validation.middleware';

// TODO - Consider alternative implementations for App class
// class App {
// 	private routes: Array<RoutesConfig> = [];

// 	public app: express.Application;

// 	constructor() {
// 		this.app = express();
// 		this.config();
// 		this.registerRoutes();
// 		this.registerMiddleware();
// 	}

// 	private config(): void {
// 		this.app.use(bodyParser.json());
// 		this.app.use(bodyParser.urlencoded({ extended: false }));
// 		this.app.use(cors());
// 		this.app.use(helmet());
// 	}

// 	private registerRoutes(): void {
// 		const listRoutes = new ListRoutes(this.app);
// 		const listItemRoutes = new ListItemRoutes(this.app);
// 		const userRoutes = new UserRoutes(this.app);
// 		const commonRoutes = new CommonRoutes(this.app);

// 		this.routes.push(listRoutes);
// 		this.routes.push(listItemRoutes);
// 		this.routes.push(userRoutes);
// 		this.routes.push(commonRoutes);

// 		this.routes.forEach((route: RoutesConfig) => {
// 			console.log(`Routes configured for ${route.getName()}`);
// 		});
// 	}

// 	private registerMiddleware(): void {
// 		this.app.use(ErrorHandlerMiddleware.handleError);
// 		this.app.use(ValidationMiddleware.validate);
// 		console.log(`Middleware registered...`);
// 	}
// }

// export default new App().app;

export class App {
	public app: Application;
	public server: Server;
	public port: number;

	constructor() {
		this.app = express();
		this.server = new Server();
		this.port = config.PORT;
	}

	public async initialiseLoggers() {
		Sentry.init({
			dsn: config.SENTRY_URL,
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
		// registerCommonRoutes(this.app);
		// registerListRoutes(this.app);
		// registerListItemRoutes(this.app);
		// registerUserRoutes(this.app);
		console.log('Routes registered...');
	}

	public async registerMiddleware() {
		// NOT NEEDED HERE
		// this.app.use(validateRequest);
		// this.app.use(validateBody);
		// this.app.use(handleInvalidUrl;
		// this.app.use(handleErrors);
		console.log('Middleware registered...');
	}

	public async start() {
		return new Promise<void>((resolve) => {
			this.server = this.app.listen(this.port, resolve);
			console.log(`Server listening on port ${this.port}...`);
			console.log(`Environment - ${config.NODE_ENV}`);
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
