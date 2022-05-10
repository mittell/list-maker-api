import ListItemDao from '../dao/listItem.dao';
import { IService } from '../../common/interfaces/service.interface';

class ListItemService implements IService {
	async list() {
		return ListItemDao.getListItems();
	}

	async listByListId(id: string) {
		return ListItemDao.getListItemsByListId(id);
	}

	async getById(id: string) {
		return ListItemDao.getListItemById(id);
	}

	async getByIdAndUserId(id: string, userId: string) {
		return ListItemDao.getListItemByIdAndUserId(id,userId);
	}

	async create(listItemData: any) {
		return ListItemDao.addListItem(listItemData);
	}

	//@ts-expect-error
	async putById({ id, ...listItemData }) {
		return ListItemDao.updateListItemById(id, listItemData);
	}

	//@ts-expect-error
	async patchById({ id, ...listItemData }) {
		return ListItemDao.updateListItemById(id, listItemData);
	}

	async deleteById(id: string) {
		return ListItemDao.removeListItemById(id);
	}
}

export default new ListItemService();
