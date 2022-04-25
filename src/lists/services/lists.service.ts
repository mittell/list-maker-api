import ListsDao from '../dao/lists.dao';
import { CRUD } from '../../common/interfaces/crud.interface';

class ListService implements CRUD {
	async list(limit: number, page: number) {
		return ListsDao.getLists(limit, page);
	}

	async getById(id: string) {
		return ListsDao.getListById(id);
	}

	// Add CreateListDto here...
	async create(listData: any) {
		return ListsDao.addList(listData);
	}

	// Add UpdateListDto here...
	async putById(id: string, listData: any) {
		return ListsDao.updateListById(id, listData);
	}

	// Add UpdateListDto here...
	async patchById(id: string, listData: any) {
		return ListsDao.updateListById(id, listData);
	}

	async deleteById(id: string) {
		return ListsDao.removeListById(id);
	}
}

export default new ListService();
