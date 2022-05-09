import { Request, Response, NextFunction } from 'express';
import ListService from '../services/list.service';
import ListItemService from '../../listItem/services/listItem.service';
import { ListToReturnDto } from '../dto/listToReturn.dto';
import { ListToCreateDto } from '../dto/listToCreate.dto';
import { ListToUpdateDto } from '../dto/listToUpdate.dto';
import { NotFoundError } from '../../common/types/error.type';

class ListController {
	async getLists(req: Request, res: Response, next: NextFunction) {
		// TODO - Need a better way to validate and sanitise this...
		let page: number = isNaN(req.body.page) ? 0 : req.body.page;
		let limit: number = isNaN(req.body.limit) ? 10 : req.body.limit;

		await ListService.list(limit, page)
			.then((lists) => {
				let listsToReturn: ListToReturnDto[] = [];
				lists.forEach((list) => {
					let listToAdd: ListToReturnDto = new ListToReturnDto();
					listToAdd.mapFromDocument(list);
					listsToReturn.push(listToAdd);
				});
				res.status(200).send({ page, limit, lists: listsToReturn });
			})
			.catch((error) => {
				next(error);
			});
	}

	async getListById(req: Request, res: Response, next: NextFunction) {
		let listId = req.body.id;
		// TODO - Need a better way to validate and sanitise this...
		let getListItems = req.body.listItems;

		await ListService.getById(listId)
			.then(async (existingList) => {
				if (!existingList) {
					next(new NotFoundError());
				}

				let listToReturn: ListToReturnDto = new ListToReturnDto();

				listToReturn.mapFromDocument(existingList);

				if (existingList && getListItems) {
					await ListItemService.listByListId(listId).then(
						(listItems) => {
							listToReturn.mapListItemsFromDocument(listItems);
						}
					);
				}

				res.status(200).send(listToReturn);
			})
			.catch((error) => {
				next(error);
			});
	}

	async createList(req: Request, res: Response, next: NextFunction) {
		// TODO - Check existing UserId is valid here...

		let listToCreate: ListToCreateDto = new ListToCreateDto();

		listToCreate.mapFromRequest(req.body);

		await ListService.create(listToCreate)
			.then((id) => {
				listToCreate.id = id;
				res.status(201).send({ id: listToCreate.id });
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchList(req: Request, res: Response, next: NextFunction) {
		// TODO - Check existing UserId is valid here...

		let listToUpdate: ListToUpdateDto = new ListToUpdateDto();

		listToUpdate.mapFromRequest(req.body);

		await ListService.patchById(listToUpdate)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async putList(req: Request, res: Response, next: NextFunction) {
		// TODO - Check existing UserId is valid here...
		
		let listToUpdate: ListToUpdateDto = new ListToUpdateDto();

		listToUpdate.mapFromRequest(req.body);

		await ListService.putById(listToUpdate)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async removeList(req: Request, res: Response, next: NextFunction) {
		let listId = req.body.id;

		await ListService.getById(listId)
			.then(async (existingList) => {
				if (!existingList) {
					next(new NotFoundError());
				}

				//@ts-expect-error
				await ListService.deleteById(existingList._id).then(() => {
					res.status(204).send();
				});
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new ListController();
