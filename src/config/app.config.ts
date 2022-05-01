import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import { RoutesConfig } from '../common/config/routes.config';
import { ListRoutes } from '../list/routes/list.routes';
import { ListItemRoutes } from '../listItem/routes/listItem.routes';
import { UserRoutes } from '../user/routes/user.routes';
import { CommonRoutes } from '../common/routes/common.routes';
import ErrorHandlerMiddleware from '../common/middleware/error.middleware';
import ValidationMiddleware from '../common/middleware/validation.middleware';

// TODO - Consider alternative implementations for App class
class App {
	private routes: Array<RoutesConfig> = [];

	public app: express.Application;

	constructor() {
		this.app = express();
		this.config();
		this.registerRoutes();
		this.registerMiddleware();
	}

	private config(): void {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(cors());
		this.app.use(helmet());
	}

	private registerRoutes(): void {
		const listRoutes = new ListRoutes(this.app);
		const listItemRoutes = new ListItemRoutes(this.app);
		const userRoutes = new UserRoutes(this.app);
		const commonRoutes = new CommonRoutes(this.app);

		this.routes.push(listRoutes);
		this.routes.push(listItemRoutes);
		this.routes.push(userRoutes);
		this.routes.push(commonRoutes);

		this.routes.forEach((route: RoutesConfig) => {
			console.log(`Routes configured for ${route.getName()}`);
		});
	}

	private registerMiddleware(): void {
		this.app.use(ErrorHandlerMiddleware.handleError);
		this.app.use(ValidationMiddleware.validate);
		console.log(`Middleware registered...`);
	}
}

export default new App().app;
