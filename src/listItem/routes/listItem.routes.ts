import { Application, Router } from 'express';
import env from '../../config/env.config';
import ListItemController from '../controllers/listItem.controller';
import { extractListItemId } from '../middleware/listItem.middleware';
import {
	validateBody,
	validateRequest,
} from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

export function registerListItemRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION}/listItems`, listItemRoutes());
}

export function listItemRoutes() {
	const router = Router();

	router.get('/', ListItemController.getListItems);
	router.post(
		'/',
		validateRequest(listItemCreateValidators()),
		ListItemController.createListItem
	);

	router.get(
		'/:listItemId',
		extractListItemId,
		ListItemController.getListItemById
	);
	router.put(
		'/:listItemId',
		extractListItemId,
		validateRequest(listItemPutValidators()),
		ListItemController.putListItem
	);

	router.patch(
		'/:listItemId',
		extractListItemId,
		validateBody(),
		validateRequest(listItemPatchValidators()),
		ListItemController.patchListItem
	);

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
		body('listId').exists().notEmpty(), // TODO - ListId needs to be validated somewhere?
	];
}

function listItemPutValidators() {
	return [
		body('title').exists().notEmpty(),
		body('description').exists().notEmpty(),
		body('isComplete').if(body('isComplete').exists()).isBoolean(),
		body('listId').exists().notEmpty(), // TODO - ListId needs to be validated somewhere?
	];
}

function listItemPatchValidators() {
	return [
		body('title').optional().notEmpty(),
		body('description').optional().notEmpty(),
		body('isComplete').optional().isBoolean(),
		body('listId').optional().notEmpty(), // TODO - ListId needs to be validated somewhere?
	];
}
