import { Application, Router } from 'express';
import env from '../../config/env.config';
import ListItemController from '../controllers/listItem.controller';
import { extractListItemId } from '../middleware/listItem.middleware';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

export function registerListItemRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION}/listItems`, listItemRoutes());
}

export function listItemRoutes() {
	const router = Router();

	// TODO - Add User Authentication here...
	router.get('/', ListItemController.getListItems);

	// TODO - Add User Authentication here...
	router.post(
		'/',
		validateRequest(listItemCreateValidators()),
		ListItemController.createListItem
	);

	// TODO - Add User Authentication here...
	router.get(
		'/:listItemId',
		extractListItemId,
		ListItemController.getListItemById
	);

	// TODO - Add User Authentication here...
	router.put(
		'/:listItemId',
		extractListItemId,
		validateRequest(listItemPutValidators()),
		ListItemController.putListItem
	);

	// TODO - Add User Authentication here...
	router.patch(
		'/:listItemId',
		extractListItemId,
		validateRequest(listItemPatchValidators()),
		ListItemController.patchListItem
	);

	// TODO - Add User Authentication here...
	router.delete(
		'/:listItemId',
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
