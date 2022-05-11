import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../common/types/error.type';
import { ListItemToCreateDto } from '../dto/listItemToCreate.dto';
import { ListItemToReturnDto } from '../dto/listItemToReturn.dto';
import { ListItemToUpdateDto } from '../dto/listItemToUpdate.dto';
import ListItemService from '../services/listItem.service';
import ListService from '../../list/services/list.service';

class ListItemController {
	async getListItems(_req: Request, res: Response, next: NextFunction) {
		await ListItemService.list()
			.then((listItems) => {
				let listItemsToReturn: ListItemToReturnDto[] = [];
				listItems.forEach((listItem) => {
					let listItemToAdd: ListItemToReturnDto =
						new ListItemToReturnDto();
					listItemToAdd.mapFromDocument(listItem);
					listItemsToReturn.push(listItemToAdd);
				});
				res.status(200).send(listItemsToReturn);
			})
			.catch((error) => {
				next(error);
			});
	}

	async getListItemById(req: Request, res: Response, next: NextFunction) {
		let listItemId = req.body.id;
		let userId = req.body.jwt.userId;

		await ListItemService.getByIdAndUserId(listItemId, userId)
			.then((existingListItem) => {
				if (!existingListItem) {
					next(new NotFoundError());
				} else {
					let listItemToReturn: ListItemToReturnDto =
						new ListItemToReturnDto();

					listItemToReturn.mapFromDocument(existingListItem);

					res.status(200).send(listItemToReturn);
				}
			})
			.catch((error) => {
				next(error);
			});
	}

	async createListItem(req: Request, res: Response, next: NextFunction) {
		let userId = req.body.jwt.userId;
		let listItemToCreate: ListItemToCreateDto = new ListItemToCreateDto();

		listItemToCreate.mapFromRequest(req.body);
		listItemToCreate.userId = userId;

		await ListService.getByIdAndUserId(listItemToCreate.listId, userId)
			.then(async (existingList) => {
				if (!existingList) {
					next(new NotFoundError());
				} else {
					await ListItemService.create(listItemToCreate)
						.then((id) => {
							listItemToCreate.id = id;
							res.status(201).send({ id: listItemToCreate.id });
						})
						.catch((error) => {
							next(error);
						});
				}
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchListItem(req: Request, res: Response, next: NextFunction) {
		let userId = req.body.jwt.userId;
		let listItemToUpdate: ListItemToUpdateDto = new ListItemToUpdateDto();

		listItemToUpdate.mapFromRequest(req.body);
		listItemToUpdate.userId = userId;

		await ListItemService.patchById(listItemToUpdate)
			.then((existingListItem) => {
				if (!existingListItem) {
					next(new NotFoundError());
				} else {
					res.status(202).send();
				}
			})
			.catch((error) => {
				next(error);
			});
	}

	async putListItem(req: Request, res: Response, next: NextFunction) {
		let userId = req.body.jwt.userId;
		let listItemToUpdate: ListItemToUpdateDto = new ListItemToUpdateDto();

		listItemToUpdate.mapFromRequest(req.body);
		listItemToUpdate.userId = userId;

		await ListItemService.putById(listItemToUpdate)
			.then((existingListItem) => {
				if (!existingListItem) {
					next(new NotFoundError());
				} else {
					res.status(202).send();
				}
			})
			.catch((error) => {
				next(error);
			});
	}

	async removeListItem(req: Request, res: Response, next: NextFunction) {
		let listItemId = req.body.id;
		let userId = req.body.jwt.userId;

		await ListItemService.getByIdAndUserId(listItemId, userId)
			.then(async (existingListItem) => {
				if (!existingListItem) {
					next(new NotFoundError());
				} else {
					await ListItemService.deleteById(existingListItem._id).then(
						() => {
							res.status(204).send();
						}
					);
				}
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new ListItemController();
