import { Application, Router } from 'express';
import env from '../../config/env.config';
import ListController from '../controllers/list.controller';
import {
	extractListId,
	extractListItems,
	extractPageLimit,
} from '../middleware/list.middleware';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';
import { validateJsonWebToken } from '../../common/middleware/jwt.middleware';

export function registerListRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION}/lists`, listRoutes());
}

export function listRoutes() {
	const router = Router();

	router.get(
		'/',
		validateJsonWebToken(),
		extractPageLimit,
		ListController.getListsByUserId
	);

	router.post(
		'/',
		validateJsonWebToken(),
		validateRequest(listCreateValidators()),
		ListController.createList
	);

	router.get(
		'/:listId',
		validateJsonWebToken(),
		extractListId,
		extractListItems,
		ListController.getListById
	);

	router.put(
		'/:listId',
		validateJsonWebToken(),
		extractListId,
		validateRequest(listPutValidators()),
		ListController.putList
	);

	router.patch(
		'/:listId',
		validateJsonWebToken(),
		extractListId,
		validateRequest(listPatchValidators()),
		ListController.patchList
	);

	router.delete(
		'/:listId',
		validateJsonWebToken(),
		extractListId,
		ListController.removeList
	);

	return router;
}

function listCreateValidators() {
	return [
		body('title').exists().notEmpty(),
		body('description').exists().notEmpty(),
	];
}

function listPutValidators() {
	return [
		body('title').exists().notEmpty(),
		body('description').exists().notEmpty(),
	];
}

function listPatchValidators() {
	return [
		body('title').optional().notEmpty(),
		body('description').optional().notEmpty(),
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
				body['title'] !== undefined ||
				body['description'] !== undefined
			) {
				return true;
			}

			throw new Error('Body does not contain valid data');
		}),
	];
}
