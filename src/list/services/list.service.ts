import ListDao from '../dao/list.dao';
import { CRUD } from '../../common/interfaces/crud.interface';

class ListService implements CRUD {
	async list(limit: number, page: number) {
		return ListDao.getLists(limit, page);
	}

	async getById(id: string) {
		return ListDao.getListById(id);
	}

	// Add CreateListDto here...
	async create(listData: any) {
		return ListDao.addList(listData);
	}

	// Add UpdateListDto here...
	async putById(id: string, listData: any) {
		return ListDao.updateListById(id, listData);
	}

	// Add UpdateListDto here...
	async patchById(id: string, listData: any) {
		return ListDao.updateListById(id, listData);
	}

	async deleteById(id: string) {
		return ListDao.removeListById(id);
	}
}

export default new ListService();
