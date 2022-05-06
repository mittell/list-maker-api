import express from 'express';
import { RoutesConfig } from '../../common/types/routes.type';
import ListItemController from '../controllers/listItem.controller';
import ListItemMiddleware from '../middleware/listItem.middleware';
import ValidationMiddleware from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

export class ListItemRoutes extends RoutesConfig {
	constructor(app: express.Application) {
		super(app, 'ListItemRoutes');
	}

	// TODO - Review optional and required logic methods from express-validator
	configureRoutes() {
		this.app
			.route(`/api/v1/listItems`)
			.get(ListItemController.getListItems) // TODO - Remove this?
			.post(
				ValidationMiddleware.validate([
					body('title').exists().notEmpty(),
					body('description').exists().notEmpty(),
					body('isComplete')
						.if(body('isComplete').exists())
						.isBoolean(),
					body('listId').exists().notEmpty(), // TODO - ListId needs to be validated somewhere?
				]),
				ListItemController.createListItem
			);

		this.app.param(`listItemId`, ListItemMiddleware.extractListItemId);
		this.app
			.route(`/api/v1/listItems/:listItemId`)
			.get(ListItemController.getListItemById)
			.put(
				ValidationMiddleware.validate([
					body('title').exists().notEmpty(),
					body('description').exists().notEmpty(),
					body('isComplete')
						.if(body('isComplete').exists())
						.isBoolean(),
					body('listId').exists().notEmpty(), // TODO - ListId needs to be validated somewhere?
				]),
				ListItemController.putListItem
			)
			.patch(
				ValidationMiddleware.validate([
					body('title').if(body('title').exists()).notEmpty(),
					body('description')
						.if(body('description').exists())
						.notEmpty(),
					body('isComplete')
						.if(body('isComplete').exists())
						.isBoolean(),
					body('listId').if(body('listId').exists()).notEmpty(), // TODO - ListId needs to be validated somewhere?
				]),
				ListItemController.patchListItem
			)
			.delete(ListItemController.removeListItem);

		return this.app;
	}
}
