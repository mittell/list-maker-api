import { Request, Response, NextFunction } from 'express';
import ListService from '../services/list.service';

class ListController {
	async getLists(_req: Request, res: Response, next: NextFunction) {
		await ListService.list(100, 0)
			.then((lists) => {
				res.status(200).send(lists);
			})
			.catch((error) => {
				next(error);
			});
	}

	async getListById(req: Request, res: Response, next: NextFunction) {
		await ListService.getById(req.body.id)
			.then((list) => {
				res.status(200).send(list);
			})
			.catch((error) => {
				next(error);
			});
	}

	async createList(req: Request, res: Response, next: NextFunction) {
		await ListService.create(req.body)
			.then((id) => {
				res.status(201).send({ id });
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchList(req: Request, res: Response, next: NextFunction) {
		await ListService.patchById(req.body.id, req.body)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async putList(req: Request, res: Response, next: NextFunction) {
		await ListService.putById(req.body.id, req.body)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async removeList(req: Request, res: Response, next: NextFunction) {
		await ListService.deleteById(req.body.id)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new ListController();
