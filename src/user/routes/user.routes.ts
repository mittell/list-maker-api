import express from 'express';
import { RoutesConfig } from '../../common/types/routes.type';
import UserController from '../controllers/user.controller';
import UserMiddleware from '../middleware/user.middleware';
import ValidationMiddleware from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

export class UserRoutes extends RoutesConfig {
	constructor(app: express.Application) {
		super(app, 'UserRoutes');
	}

	configureRoutes() {
		this.app
			.route(`/api/v1/users`)
			.get(UserController.getUsers) // TODO - Remove
			.post(
				ValidationMiddleware.validate([
					body('username').exists().notEmpty(),
					body('email').exists().notEmpty().isEmail(),
					body('password').exists().notEmpty().isLength({ min: 6 }),
				]),
				UserController.createUser
			);

		this.app.param(`userId`, UserMiddleware.extractUserId);
		this.app
			.route(`/api/v1/users/:userId`)
			.get(UserController.getUserById) // TODO - Needs authentication!
			.put(
				ValidationMiddleware.validate([
					body('username').exists().notEmpty(),
					body('email').exists().notEmpty().isEmail(),
					body('password').exists().notEmpty().isLength({ min: 6 }),
				]),
				UserController.putUser
			) // TODO - Needs authentication!
			.patch(
				ValidationMiddleware.validate([
					body('username').if(body('username').exists()).notEmpty(),
					body('email')
						.if(body('email').exists())
						.notEmpty()
						.isEmail(),
					body('password')
						.if(body('password').exists())
						.notEmpty()
						.isLength({ min: 6 }),
				]),
				UserController.patchUser
			) // TODO - Needs authentication!
			.delete(UserController.removeUser); // TODO - Remove?

		return this.app;
	}
}
