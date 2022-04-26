import express from 'express';
import ListService from '../services/list.service';

class ListController {
	async getLists(_req: express.Request, res: express.Response) {
		const lists = await ListService.list(100, 0);
		res.status(200).send(lists);
	}

	async getListById(req: express.Request, res: express.Response) {
		const list = await ListService.getById(req.body.id);
		res.status(200).send(list);
	}

	async createList(req: express.Request, res: express.Response) {
		const listId = await ListService.create(req.body);
		res.status(201).send({ id: listId });
	}

	async patchList(req: express.Request, res: express.Response) {
		await ListService.patchById(req.body.id, req.body);
		res.status(204).send();
	}

	async putList(req: express.Request, res: express.Response) {
		await ListService.putById(req.body.id, req.body);
		res.status(204).send();
	}

	async removeList(req: express.Request, res: express.Response) {
		await ListService.deleteById(req.body.id);
		res.status(204).send();
	}
}

export default new ListController();
