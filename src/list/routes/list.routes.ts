import express from 'express';
import { RoutesConfig } from '../../common/types/routes.type';
import ListController from '../controllers/list.controller';
import ListMiddleware from '../middleware/list.middleware';
import ValidationMiddleware from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

export class ListRoutes extends RoutesConfig {
	constructor(app: express.Application) {
		super(app, 'ListRoutes');
	}

	// TODO - Review optional and required logic methods from express-validator
	configureRoutes() {
		this.app
			.route(`/api/v1/lists`)
			.get(ListController.getLists)
			.post(
				ValidationMiddleware.validate([
					body('title').exists().notEmpty(),
					body('description').exists().notEmpty(),
					body('userId').exists().notEmpty(), // TODO - UserId needs to be validated somewhere?
				]),
				ListController.createList
			);

		this.app.param(`listId`, ListMiddleware.extractListId);
		this.app
			.route(`/api/v1/lists/:listId`)
			.get(ListController.getListById)
			.put(
				ValidationMiddleware.validate([
					body('title').exists().notEmpty(),
					body('description').exists().notEmpty(),
					body('userId').exists().notEmpty(), // TODO - UserId needs to be validated somewhere?
				]),
				ListController.putList
			)
			.patch(
				ValidationMiddleware.validate([
					body('title').if(body('title').exists()).notEmpty(),
					body('description')
						.if(body('description').exists())
						.notEmpty(),
					body('userId').if(body('userId').exists()).notEmpty(), // TODO - UserId needs to be validated somewhere?
				]),
				ListController.patchList
			)
			.delete(ListController.removeList);

		return this.app;
	}
}
