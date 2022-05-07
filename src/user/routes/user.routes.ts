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

export function userRoutes() {
	const router = Router();

	router.get('/', UserController.getUsers); // TODO - Remove
	router.post(
		'/',
		validateRequest(userCreateValidators()),
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
		validateRequest(userPutValidators()),
		UserController.putUser // TODO - Needs authentication!
	);

	router.patch(
		'/:userId',
		extractUserId,
		validateBody(),
		validateRequest(userPatchValidators()),
		UserController.patchUser // TODO - Needs authentication!
	);

	router.delete(
		'/:userId',
		extractUserId,
		UserController.removeUser // TODO - Remove?
	);

	return router;
}

function userCreateValidators() {
	return [
		body('username').exists().notEmpty(),
		body('email').exists().notEmpty().isEmail(),
		body('password').exists().notEmpty().isLength({ min: 6 }),
	];
}

function userPutValidators() {
	return [
		body('username').exists().notEmpty(),
		body('email').exists().notEmpty().isEmail(),
		body('password').exists().notEmpty().isLength({ min: 6 }),
	];
}

function userPatchValidators() {
	return [
		body('username').optional().notEmpty(),
		body('email').optional().notEmpty().isEmail(),
		body('password').optional().notEmpty().isLength({ min: 6 }),
	];
}
