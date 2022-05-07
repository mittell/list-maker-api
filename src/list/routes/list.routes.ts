import { Application, Router } from 'express';
import env from '../../config/env.config';
import ListController from '../controllers/list.controller';
import { extractListId } from '../middleware/list.middleware';
import {
	validateBody,
	validateRequest,
} from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

// TODO - Move validation criteria to their own methods?

export function registerListRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION || 'v1'}/lists`, listRoutes());
}

export function listRoutes() {
	const router = Router();

	router.get('/', ListController.getLists);
	router.post(
		'/',
		validateRequest([
			body('title').exists().notEmpty(),
			body('description').exists().notEmpty(),
			body('userId').exists().notEmpty(), // TODO - UserId needs to be validated somewhere?
		]),
		ListController.createList
	);

	router.get('/:listId', extractListId, ListController.getListById);
	router.put(
		'/:listId',
		extractListId,
		validateRequest([
			body('title').exists().notEmpty(),
			body('description').exists().notEmpty(),
			body('userId').exists().notEmpty(), // TODO - UserId needs to be validated somewhere?
		]),
		ListController.putList
	);

	router.patch(
		'/:listId',
		extractListId,
		validateBody(),
		validateRequest([
			body('title').if(body('title').exists()).notEmpty(),
			body('description').if(body('description').exists()).notEmpty(),
			body('userId').if(body('userId').exists()).notEmpty(), // TODO - UserId needs to be validated somewhere?
		]),
		ListController.patchList
	);

	router.delete('/:listId', extractListId, ListController.removeList);

	return router;
}
