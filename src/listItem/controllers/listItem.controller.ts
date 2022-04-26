import { Request, Response, NextFunction } from 'express';
import ListItemService from '../services/listItem.service';

class ListItemController {
	async getListItems(_req: Request, res: Response, next: NextFunction) {
		await ListItemService.list()
			.then((listItems) => {
				res.status(200).send(listItems);
			})
			.catch((error) => {
				next(error);
			});
	}

	async getListItemById(req: Request, res: Response, next: NextFunction) {
		await ListItemService.getById(req.body.id)
			.then((listItem) => {
				res.status(200).send(listItem);
			})
			.catch((error) => {
				next(error);
			});
	}

	async createListItem(req: Request, res: Response, next: NextFunction) {
		await ListItemService.create(req.body)
			.then((id) => {
				res.status(201).send({ id });
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchListItem(req: Request, res: Response, next: NextFunction) {
		await ListItemService.patchById(req.body.id, req.body)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async putListItem(req: Request, res: Response, next: NextFunction) {
		await ListItemService.putById(req.body.id, req.body)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async removeListItem(req: Request, res: Response, next: NextFunction) {
		await ListItemService.deleteById(req.body.id)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new ListItemController();
