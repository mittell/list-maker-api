import express from 'express';
import { RoutesConfig } from '../../common/config/routes.config';
import UserController from '../controllers/user.controller';
import UserMiddleware from '../middleware/user.middleware';

export class UserRoutes extends RoutesConfig {
	constructor(app: express.Application) {
		super(app, 'UserRoutes');
	}

	configureRoutes() {
		this.app
			.route(`/api/v1/users`)
			.get(UserController.getUsers)
			.post(UserController.createUser);

		this.app.param(`userId`, UserMiddleware.extractUserId);
		this.app
			.route(`/api/v1/users/:userId`)
			.get(UserController.getUserById)
			.put(UserController.putUser)
			.patch(UserController.patchUser)
			.delete(UserController.removeUser);

		return this.app;
	}
}
