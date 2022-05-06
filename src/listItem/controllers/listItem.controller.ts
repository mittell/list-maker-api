import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../common/types/error.type';
import { ListItemToCreateDto } from '../dto/listItemToCreate.dto';
import { ListItemToReturnDto } from '../dto/listItemToReturn.dto';
import { ListItemToUpdateDto } from '../dto/listItemToUpdate.dto';
import ListItemService from '../services/listItem.service';

class ListItemController {
	async getListItems(_req: Request, res: Response, next: NextFunction) {
		let listItemsToReturn: ListItemToReturnDto[] = [];

		await ListItemService.list()
			.then((listItems) => {
				listItems.forEach((listItem) => {
					// TODO - Review implementation..
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
		// TODO - Remove try-catch use
		try {
			const existingListItem = await ListItemService.getById(req.body.id);

			if (!existingListItem) {
				next(new NotFoundError());
			}

			let listItemToReturn: ListItemToReturnDto =
				new ListItemToReturnDto();
			listItemToReturn.mapFromDocument(existingListItem);

			res.status(200).send(listItemToReturn);
		} catch (error) {
			next(error);
		}
	}

	async createListItem(req: Request, res: Response, next: NextFunction) {
		let listItemToCreate: ListItemToCreateDto = new ListItemToCreateDto();
		listItemToCreate.mapListItemFromRequest(req.body);

		await ListItemService.create(req.body)
			.then((id) => {
				// TODO - Review this idea of updating the Id and returning the object received...
				listItemToCreate.updateId(id);
				res.status(201).send({ id: listItemToCreate.getId() });
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchListItem(req: Request, res: Response, next: NextFunction) {
		let listItemToUpdate: ListItemToUpdateDto = new ListItemToUpdateDto();
		listItemToUpdate.mapListItemFromRequest(req.body);

		await ListItemService.patchById(listItemToUpdate.id, listItemToUpdate)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async putListItem(req: Request, res: Response, next: NextFunction) {
		let listItemToUpdate: ListItemToUpdateDto = new ListItemToUpdateDto();
		listItemToUpdate.mapListItemFromRequest(req.body);

		await ListItemService.putById(listItemToUpdate.id, listItemToUpdate)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async removeListItem(req: Request, res: Response, next: NextFunction) {
		const existingListItem = await ListItemService.getById(req.body.id);

		if (!existingListItem) {
			next(new NotFoundError());
		}

		await ListItemService.deleteById(existingListItem._id)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new ListItemController();
