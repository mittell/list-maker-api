import { Application, Request, Response } from 'express';
import { RoutesConfig } from '../../config/routes.config';

export class CommonRoutes extends RoutesConfig {
	constructor(app: Application) {
		super(app, 'CommonRoutes');
	}

	configureRoutes() {
		this.app.get('/', (_req: Request, res: Response) => {
			res.status(200).send('Hello World!');
		});

		this.app.all('*', (_req: Request, res: Response) => {
			res.status(400).send({ error: true, message: 'Invalid URL' });
		});
		return this.app;
	}
}
