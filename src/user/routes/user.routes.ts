import { Application, Router } from 'express';
import env from '../../config/env.config';
import UserController from '../controllers/user.controller';
import { extractUserId } from '../middleware/user.middleware';
import {
	validateBody,
	validateRequest,
} from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

export function registerUserRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION || 'v1'}/users`, userRoutes());
}

// TODO - Move validation criteria to their own methods?

export function userRoutes() {
	const router = Router();

	router.get('/', UserController.getUsers); // TODO - Remove
	router.post(
		'/',
		validateRequest([
			body('username').exists().notEmpty(),
			body('email').exists().notEmpty().isEmail(),
			body('password').exists().notEmpty().isLength({ min: 6 }),
		]),
		UserController.createUser
	);

	router.get(
		'/:userId',
		extractUserId,
		UserController.getUserById // TODO - Needs authentication!
	);
	router.put(
		'/:userId',
		extractUserId,
		validateRequest([
			body('username').exists().notEmpty(),
			body('email').exists().notEmpty().isEmail(),
			body('password').exists().notEmpty().isLength({ min: 6 }),
		]),
		UserController.putUser // TODO - Needs authentication!
	);

	router.patch(
		'/:userId',
		extractUserId,
		validateBody(),
		validateRequest([
			body('username').if(body('username').exists()).notEmpty(),
			body('email').if(body('email').exists()).notEmpty().isEmail(),
			body('password')
				.if(body('password').exists())
				.notEmpty()
				.isLength({ min: 6 }),
		]),
		UserController.patchUser // TODO - Needs authentication!
	);

	router.delete(
		'/:userId',
		extractUserId,
		UserController.removeUser // TODO - Remove?
	);

	return router;
}
