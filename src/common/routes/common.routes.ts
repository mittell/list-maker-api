import { Application, Request, Response, NextFunction } from 'express';
import { RoutesConfig } from '../config/routes.config';
import { ErrorCode } from '../models/errorCode.model';
import { ErrorException } from '../models/errorException.model';

export class CommonRoutes extends RoutesConfig {
	constructor(app: Application) {
		super(app, 'CommonRoutes');
	}

	configureRoutes() {
		// TODO - Update default route to a standard response
		this.app.get('/', (_req: Request, res: Response) => {
			res.status(200).send('Hello World!');
		});

		// TODO - Reconsider implementation of invalid url routing
		this.app.all(
			'*',
			(_req: Request, _res: Response, next: NextFunction) => {
				next(new ErrorException(ErrorCode.InvalidUrl));
			}
		);
		return this.app;
	}
}
