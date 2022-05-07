import { Application, Router } from 'express';
import env from '../../config/env.config';
import ListController from '../controllers/list.controller';
import { extractListId } from '../middleware/list.middleware';
import {
	validateBody,
	validateRequest,
} from '../../common/middleware/validation.middleware';
import { body } from 'express-validator';

export function registerListRoutes(app: Application) {
	app.use(`/api/${env.API_VERSION}/lists`, listRoutes());
}

export function listRoutes() {
	const router = Router();

	router.get('/', ListController.getLists);
	router.post(
		'/',
		validateRequest(listCreateValidators()),
		ListController.createList
	);

	router.get('/:listId', extractListId, ListController.getListById);
	router.put(
		'/:listId',
		extractListId,
		validateRequest(listPutValidators()),
		ListController.putList
	);

	router.patch(
		'/:listId',
		extractListId,
		validateBody(),
		validateRequest(listPatchValidators()),
		ListController.patchList
	);

	router.delete('/:listId', extractListId, ListController.removeList);

	return router;
}

function listCreateValidators() {
	return [
		body('title').exists().notEmpty(),
		body('description').exists().notEmpty(),
		body('userId').exists().notEmpty(), // TODO - UserId needs to be validated somewhere?
	];
}

function listPutValidators() {
	return [
		body('title').exists().notEmpty(),
		body('description').exists().notEmpty(),
		body('userId').exists().notEmpty(), // TODO - UserId needs to be validated somewhere?
	];
}

function listPatchValidators() {
	return [
		body('title').optional().notEmpty(),
		body('description').optional().notEmpty(),
		body('userId').optional().notEmpty(), // TODO - UserId needs to be validated somewhere?
	];
}
