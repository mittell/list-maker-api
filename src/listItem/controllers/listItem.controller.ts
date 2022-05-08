import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../common/types/error.type';
import { ListItemToCreateDto } from '../dto/listItemToCreate.dto';
import { ListItemToReturnDto } from '../dto/listItemToReturn.dto';
import { ListItemToUpdateDto } from '../dto/listItemToUpdate.dto';
import ListItemService from '../services/listItem.service';

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

		await ListItemService.getById(listItemId)
			.then((existingListItem) => {
				if (!existingListItem) {
					next(new NotFoundError());
				}

				let listItemToReturn: ListItemToReturnDto =
					new ListItemToReturnDto();

				listItemToReturn.mapFromDocument(existingListItem);

				res.status(200).send(listItemToReturn);
			})
			.catch((error) => {
				next(error);
			});
	}

	async createListItem(req: Request, res: Response, next: NextFunction) {
		let listItemToCreate: ListItemToCreateDto = new ListItemToCreateDto();

		listItemToCreate.mapFromRequest(req.body);

		await ListItemService.create(req.body)
			.then((id) => {
				listItemToCreate.id = id;
				res.status(201).send({ id: listItemToCreate.id });
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchListItem(req: Request, res: Response, next: NextFunction) {
		let listItemToUpdate: ListItemToUpdateDto = new ListItemToUpdateDto();

		listItemToUpdate.mapFromRequest(req.body);

		await ListItemService.patchById(listItemToUpdate)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async putListItem(req: Request, res: Response, next: NextFunction) {
		let listItemToUpdate: ListItemToUpdateDto = new ListItemToUpdateDto();

		listItemToUpdate.mapFromRequest(req.body);

		await ListItemService.putById(listItemToUpdate)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async removeListItem(req: Request, res: Response, next: NextFunction) {
		let listItemId = req.body.id;

		await ListItemService.getById(listItemId)
			.then(async (existingListItem) => {
				if (!existingListItem) {
					next(new NotFoundError());
				}

				//@ts-expect-error
				await ListItemService.deleteById(existingListItem._id).then(
					() => {
						res.status(204).send();
					}
				);
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new ListItemController();
