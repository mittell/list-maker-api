import { Application, Request, Response, Router } from 'express';
import env from '../../config/env.config';

export function registerCommonRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION}`, commonRoutes());
}

export function commonRoutes() {
	const router = Router();

	router.get('/', async (_req: Request, res: Response) => {
		res.status(200).json({
			name: 'List Maker API',
			description: 'API for List Maker App.',
			version: env.API_VERSION,
		});
	});

	return router;
}
