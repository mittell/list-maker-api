import ListDao from '../dao/list.dao';
import { CRUD } from '../../common/interfaces/crud.interface';

class ListService implements CRUD {
	async list(limit?: number, page?: number) {
		return ListDao.getLists(limit, page);
	}

	async getById(id: string) {
		return ListDao.getListById(id);
	}

	// TODO - Reference DTO here instead of any!
	async create(listData: any) {
		return ListDao.addList(listData);
	}

	// TODO - Reference DTO here instead of any!
	async putById(id: string, listData: any) {
		return ListDao.updateListById(id, listData);
	}

	// TODO - Reference DTO here instead of any!
	async patchById(id: string, listData: any) {
		return ListDao.updateListById(id, listData);
	}

	async deleteById(id: string) {
		return ListDao.removeListById(id);
	}
}

export default new ListService();
