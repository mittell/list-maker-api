import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import { RoutesConfig } from './routes.config';
import { ListRoutes } from '../lists/lists.routes.config';
import { CommonRoutes } from '../common/routes/common.routes.config';

class App {
	private routes: Array<RoutesConfig> = [];

	public app: express.Application;

	constructor() {
		this.app = express();
		this.config();
		this.registerRoutes();
	}

	private config(): void {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(cors());
		this.app.use(helmet());
	}

	private registerRoutes(): void {
		const listRoutes = new ListRoutes(this.app);
		const commonRoutes = new CommonRoutes(this.app);

		this.routes.push(listRoutes);
		this.routes.push(commonRoutes);

		this.routes.forEach((route: RoutesConfig) => {
			console.log(`Routes configured for ${route.getName()}`);
		});
	}
}

export default new App().app;
