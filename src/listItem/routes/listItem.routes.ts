import express from 'express';
import { RoutesConfig } from '../../common/config/routes.config';
import ListItemController from '../controllers/listItem.controller';
import ListItemMiddleware from '../middleware/listItem.middleware';

export class ListItemRoutes extends RoutesConfig {
	constructor(app: express.Application) {
		super(app, 'ListItemRoutes');
	}

	configureRoutes() {
		this.app
			.route(`/api/v1/listItems`)
			.get(ListItemController.getListItems)
			.post(ListItemController.createListItem);

		this.app.param(`listItemId`, ListItemMiddleware.extractListItemId);
		this.app
			.route(`/api/v1/listItems/:listItemId`)
			.get(ListItemController.getListItemById)
			.put(ListItemController.putListItem)
			.patch(ListItemController.patchListItem)
			.delete(ListItemController.removeListItem);

		return this.app;
	}
}
