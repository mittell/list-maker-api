import { Application, Router } from 'express';
import env from '../../config/env.config';
import ListController from '../controllers/list.controller';
import ListMiddleware from '../middleware/list.middleware';
import ValidationMiddleware from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

export function registerListRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION || 'v1'}/lists`, listRoutes());
}

export function listRoutes() {
	const router = Router();

	router.get('/', ListController.getLists);
	router.post(
		'/',
		ValidationMiddleware.validate([
			body('title').exists().notEmpty(),
			body('description').exists().notEmpty(),
			body('userId').exists().notEmpty(), // TODO - UserId needs to be validated somewhere?
		]),
		ListController.createList
	);

	router.get(
		'/:listId',
		ListMiddleware.extractListId,
		ListController.getListById
	);
	router.put(
		'/:listId',
		ListMiddleware.extractListId,
		ValidationMiddleware.validate([
			body('title').exists().notEmpty(),
			body('description').exists().notEmpty(),
			body('userId').exists().notEmpty(), // TODO - UserId needs to be validated somewhere?
		]),
		ListController.putList
	);

	router.patch(
		'/:listId',
		ListMiddleware.extractListId,
		ValidationMiddleware.validate([
			body('title').if(body('title').exists()).notEmpty(),
			body('description').if(body('description').exists()).notEmpty(),
			body('userId').if(body('userId').exists()).notEmpty(), // TODO - UserId needs to be validated somewhere?
		]),
		ListController.patchList
	);

	router.delete(
		'/:listId',
		ListMiddleware.extractListId,
		ListController.removeList
	);

	return router;
}
