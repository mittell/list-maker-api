import ListItemDao from '../dao/listItem.dao';
import { CRUD } from '../../common/interfaces/crud.interface';

class ListItemService implements CRUD {
	async list() {
		return ListItemDao.getListItems();
	}

	async listByListId(id: string) {
		return ListItemDao.getListItemsByListId(id);
	}

	async getById(id: string) {
		return ListItemDao.getListItemById(id);
	}

	// TODO - Reference DTO here instead of any...
	async create(listItemData: any) {
		return ListItemDao.addListItem(listItemData);
	}

	// TODO - Reference DTO here instead of any...
	async putById(id: string, listItemData: any) {
		return ListItemDao.updateListItemById(id, listItemData);
	}

	// TODO - Reference DTO here instead of any...
	async patchById(id: string, listItemData: any) {
		return ListItemDao.updateListItemById(id, listItemData);
	}

	async deleteById(id: string) {
		return ListItemDao.removeListItemById(id);
	}
}

export default new ListItemService();
