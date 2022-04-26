import {Request, Response} from 'express';
import ListItemService from '../services/listItem.service';

class ListItemController {
	async getListItems(_req: Request, res: Response) {
		const listItems = await ListItemService.list();
		res.status(200).send(listItems);
	}

	async getListItemById(req: Request, res: Response) {
		const listItem = await ListItemService.getById(req.body.id);
		res.status(200).send(listItem);
	}

	async createListItem(req: Request, res: Response) {
		const listItemId = await ListItemService.create(req.body);
		res.status(201).send({ id: listItemId });
	}

	async patchListItem(req: Request, res: Response) {
		await ListItemService.patchById(req.body.id, req.body);
		res.status(204).send();
	}

	async putListItem(req: Request, res: Response) {
		await ListItemService.putById(req.body.id, req.body);
		res.status(204).send();
	}

	async removeListItem(req: Request, res: Response) {
		await ListItemService.deleteById(req.body.id);
		res.status(204).send();
	}
}

export default new ListItemController();
