import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import { CommonRoutesConfig } from '../common/common.routes.config';
import { ListRoutes } from '../lists/lists.routes.config';

class App {
	private routes: Array<CommonRoutesConfig> = [];

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
		this.routes.push(listRoutes);

		this.routes.forEach((route: CommonRoutesConfig) => {
			console.log(`Routes configured for ${route.getName()}`);
		});
	}
}

export default new App().app;
