import { Request, Response, NextFunction } from 'express';
import ListService from '../services/list.service';
import ListItemService from '../../listItem/services/listItem.service';
import { ErrorException } from '../../common/models/errorException.model';
import { ErrorCode } from '../../common/models/errorCode.model';
import { ListToReturnDto } from '../dto/listToReturn.dto';

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
		try {
			let listToReturn: ListToReturnDto = new ListToReturnDto();

			let getListItems =
				req.query.listItems === 'true' ||
				req.query.listItems === 'True';

			const existingList = await ListService.getById(req.body.id);

			if (!existingList) {
				next(new ErrorException(ErrorCode.NotFound));
			}

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
