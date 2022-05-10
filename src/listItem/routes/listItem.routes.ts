import { Application, Router } from 'express';
import env from '../../config/env.config';
import ListItemController from '../controllers/listItem.controller';
import { extractListItemId } from '../middleware/listItem.middleware';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';
import { validateJsonWebToken } from '../../common/middleware/jwt.middleware';

export function registerListItemRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION}/listItems`, listItemRoutes());
}

export function listItemRoutes() {
	const router = Router();

	// router.get('/', validateJsonWebToken(), ListItemController.getListItems);

	router.post(
		'/',
		validateJsonWebToken(),
		validateRequest(listItemCreateValidators()),
		ListItemController.createListItem
	);

	router.get(
		'/:listItemId',
		validateJsonWebToken(),
		extractListItemId,
		ListItemController.getListItemById
	);

	router.put(
		'/:listItemId',
		validateJsonWebToken(),
		extractListItemId,
		validateRequest(listItemPutValidators()),
		ListItemController.putListItem
	);

	router.patch(
		'/:listItemId',
		validateJsonWebToken(),
		extractListItemId,
		validateRequest(listItemPatchValidators()),
		ListItemController.patchListItem
	);

	router.delete(
		'/:listItemId',
		validateJsonWebToken(),
		extractListItemId,
		ListItemController.removeListItem
	);

	return router;
}

function listItemCreateValidators() {
	return [
		body('title').exists().notEmpty(),
		body('description').exists().notEmpty(),
		body('isComplete').if(body('isComplete').exists()).isBoolean(),
		body('listId').exists().notEmpty(),
	];
}

function listItemPutValidators() {
	return [
		body('title').exists().notEmpty(),
		body('description').exists().notEmpty(),
		body('isComplete').if(body('isComplete').exists()).isBoolean(),
		body('listId').exists().notEmpty(),
	];
}

function listItemPatchValidators() {
	return [
		body('title').optional().notEmpty(),
		body('description').optional().notEmpty(),
		body('isComplete').optional().isBoolean(),
		body('listId').optional().notEmpty(),
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
				body['description'] !== undefined ||
				body['isComplete'] !== undefined ||
				body['listId'] !== undefined
			) {
				return true;
			}

			throw new Error('Body does not contain valid data');
		}),
	];
}
