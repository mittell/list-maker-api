import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import ListController from './controllers/lists.controller';
import ListMiddleware from './middleware/lists.middleware';

export class ListRoutes extends CommonRoutesConfig {
	constructor(app: express.Application) {
		super(app, 'ListRoutes');
	}

	configureRoutes() {
		this.app
			.route(`/api/v1/lists`)
			.get(ListController.getLists)
			.post(ListController.createList);

		this.app.param(`listId`, ListMiddleware.extractListId);
		this.app
			.route(`/api/v1/lists/:listId`)
			.get(ListController.getListById)
			.put(ListController.putList)
			.patch(ListController.patchList)
			.delete(ListController.removeList);

		return this.app;
	}
}
