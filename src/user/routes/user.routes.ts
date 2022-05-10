import { Application, Router } from 'express';
import env from '../../config/env.config';
import UserController from '../controllers/user.controller';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';
import {
	verifyUserPassword,
	verifyUserRequest,
} from '../../common/middleware/auth.middleware';
import {
	validateJsonWebToken,
	validateRefreshBody,
	validateRefreshToken,
} from '../../common/middleware/jwt.middleware';

export function registerUserRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION}/users`, userRoutes());
}

export function userRoutes() {
	const router = Router();

	// router.get('/', UserController.getUsers);

	router.post(
		'/',
		validateRequest(userCreateValidators()),
		UserController.createUser
	);

	router.get(
		'/:userId',
		validateJsonWebToken(),
		verifyUserRequest(),
		UserController.getUserById
	);

	router.put(
		'/:userId',
		validateJsonWebToken(),
		verifyUserRequest(),
		validateRequest(userPutValidators()),
		UserController.putUser
	);

	router.patch(
		'/:userId',
		validateJsonWebToken(),
		verifyUserRequest(),
		validateRequest(userPatchValidators()),
		UserController.patchUser
	);

	router.delete(
		'/:userId',
		validateJsonWebToken(),
		verifyUserRequest(),
		UserController.removeUser
	);

	router.post(`/login`, [
		validateRequest(userLoginValidators()),
		verifyUserPassword(),
		UserController.generateJsonWebToken,
	]);

	router.post(`/refresh-token`, [
		validateJsonWebToken(),
		validateRefreshBody(),
		validateRefreshToken(),
		UserController.generateJsonWebToken,
	]);

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
		body().custom((_value, { req }) => {
			let body = req.body;
			if (
				(body.constructor === Object &&
					Object.keys(body).length === 0) ||
				(Object.keys(body).length === 1 && body['id'] !== undefined)
			) {
				throw new Error('Body cannot be empty');
			}

			return true;
		}),
		body().custom((_value, { req }) => {
			let body = req.body;

			if (
				body['username'] !== undefined ||
				body['email'] !== undefined ||
				body['password'] !== undefined
			) {
				return true;
			}

			throw new Error('Body does not contain valid data');
		}),
	];
}

function userLoginValidators() {
	return [
		body('email').exists().notEmpty().isEmail(),
		body('password').exists().notEmpty().isLength({ min: 6 }),
	];
}
