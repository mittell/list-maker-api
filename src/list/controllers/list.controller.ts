import { Request, Response, NextFunction } from 'express';
import ListService from '../services/list.service';
import ListItemService from '../../listItem/services/listItem.service';
import { ErrorException } from '../../common/models/errorException.model';
import { ErrorCode } from '../../common/models/errorCode.model';
import { ListToReturnDto } from '../dto/listToReturn.dto';
import { ListToCreateDto } from '../dto/listToCreate.dto';
import { ListToUpdateDto } from '../dto/listToUpdate.dto';

class ListController {
	async getLists(req: Request, res: Response, next: NextFunction) {
		let listsToReturn: ListToReturnDto[] = [];
		let limit = parseInt(req.query.limit as string);
		let page = parseInt(req.query.page as string);

		await ListService.list(limit, page)
			.then((lists) => {
				lists.forEach((list) => {
					let listToAdd: ListToReturnDto = new ListToReturnDto();
					listToAdd.mapListFromDocument(list);
					listToAdd.updatePageLimit(page, limit);
					listsToReturn.push(listToAdd);
				});
				res.status(200).send(listsToReturn);
			})
			.catch((error) => {
				next(error);
			});
	}

	async getListById(req: Request, res: Response, next: NextFunction) {
		try {
			let getListItems =
				req.query.listItems === 'true' ||
				req.query.listItems === 'True';

			const existingList = await ListService.getById(req.body.id);

			if (!existingList) {
				next(new ErrorException(ErrorCode.NotFound));
			}

			let listToReturn: ListToReturnDto = new ListToReturnDto();

			listToReturn.mapListFromDocument(existingList);

			if (existingList && getListItems) {
				listToReturn.mapListItemsFromDocument(
					await ListItemService.listByListId(req.body.id)
				);
			}

			res.status(200).send(listToReturn);
		} catch (error) {
			next(error);
		}
	}

	async createList(req: Request, res: Response, next: NextFunction) {
		let listToCreate: ListToCreateDto = new ListToCreateDto();
		listToCreate.mapListFromRequest(req.body);

		await ListService.create(listToCreate)
			.then((id) => {
				listToCreate.updateId(id);
				res.status(201).send({ id: listToCreate.getId() });
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchList(req: Request, res: Response, next: NextFunction) {
		if (
			req.body.title === undefined &&
			req.body.description === undefined &&
			req.body.userId === undefined
		) {
			next(new ErrorException(ErrorCode.ValidationError));
		}

		let listToUpdate: ListToUpdateDto = new ListToUpdateDto();
		listToUpdate.mapListFromRequest(req.body);

		await ListService.patchById(listToUpdate.id, listToUpdate)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async putList(req: Request, res: Response, next: NextFunction) {
		let listToUpdate: ListToUpdateDto = new ListToUpdateDto();
		listToUpdate.mapListFromRequest(req.body);

		await ListService.putById(listToUpdate.id, listToUpdate)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async removeList(req: Request, res: Response, next: NextFunction) {
		const existingList = await ListService.getById(req.body.id);

		if (!existingList) {
			next(new ErrorException(ErrorCode.NotFound));
		}

		await ListService.deleteById(existingList._id)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new ListController();
