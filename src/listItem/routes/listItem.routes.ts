import { Application, Router } from 'express';
import env from '../../config/env.config';
import ListItemController from '../controllers/listItem.controller';
import ListItemMiddleware from '../middleware/listItem.middleware';
import ValidationMiddleware from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

export function registerListItemRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION || 'v1'}/listItems`, listItemRoutes());
}

export function listItemRoutes() {
	const router = Router();

	router.get('/', ListItemController.getListItems);
	router.post(
		'/',
		ValidationMiddleware.validate([
			body('title').exists().notEmpty(),
			body('description').exists().notEmpty(),
			body('isComplete').if(body('isComplete').exists()).isBoolean(),
			body('listId').exists().notEmpty(), // TODO - ListId needs to be validated somewhere?
		]),
		ListItemController.createListItem
	);

	router.get(
		'/:listItemId',
		ListItemMiddleware.extractListItemId,
		ListItemController.getListItemById
	);
	router.put(
		'/:listItemId',
		ListItemMiddleware.extractListItemId,
		ValidationMiddleware.validate([
			body('title').exists().notEmpty(),
			body('description').exists().notEmpty(),
			body('isComplete').if(body('isComplete').exists()).isBoolean(),
			body('listId').exists().notEmpty(), // TODO - ListId needs to be validated somewhere?
		]),
		ListItemController.putListItem
	);

	router.patch(
		'/:listItemId',
		ListItemMiddleware.extractListItemId,
		ValidationMiddleware.validate([
			body('title').if(body('title').exists()).notEmpty(),
			body('description').if(body('description').exists()).notEmpty(),
			body('isComplete').if(body('isComplete').exists()).isBoolean(),
			body('listId').if(body('listId').exists()).notEmpty(), // TODO - ListId needs to be validated somewhere?
		]),
		ListItemController.patchListItem
	);

	router.delete(
		'/:listItemId',
		ListItemMiddleware.extractListItemId,
		ListItemController.removeListItem
	);

	return router;
}
