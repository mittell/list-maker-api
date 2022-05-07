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
	app.use(`/api/${env.API_VERSION || 'v1'}/listItems`, listItemRoutes());
}

// TODO - Move validation criteria to their own methods?

export function listItemRoutes() {
	const router = Router();

	router.get('/', ListItemController.getListItems);
	router.post(
		'/',
		validateRequest([
			body('title').exists().notEmpty(),
			body('description').exists().notEmpty(),
			body('isComplete').if(body('isComplete').exists()).isBoolean(),
			body('listId').exists().notEmpty(), // TODO - ListId needs to be validated somewhere?
		]),
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
		validateRequest([
			body('title').exists().notEmpty(),
			body('description').exists().notEmpty(),
			body('isComplete').if(body('isComplete').exists()).isBoolean(),
			body('listId').exists().notEmpty(), // TODO - ListId needs to be validated somewhere?
		]),
		ListItemController.putListItem
	);

	router.patch(
		'/:listItemId',
		extractListItemId,
		validateBody(),
		validateRequest([
			body('title').if(body('title').exists()).notEmpty(),
			body('description').if(body('description').exists()).notEmpty(),
			body('isComplete').if(body('isComplete').exists()).isBoolean(),
			body('listId').if(body('listId').exists()).notEmpty(), // TODO - ListId needs to be validated somewhere?
		]),
		ListItemController.patchListItem
	);

	router.delete(
		'/:listItemId',
		extractListItemId,
		ListItemController.removeListItem
	);

	return router;
}
