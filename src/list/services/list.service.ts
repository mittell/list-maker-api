import ListDao from '../dao/list.dao';
import { IService } from '../../common/interfaces/service.interface';

class ListService implements IService {
	async list(limit: number, page: number) {
		return ListDao.getLists(limit, page);
	}

	async getById(id: string) {
		return ListDao.getListById(id);
	}

	async create(listData: any) {
		return ListDao.addList(listData);
	}

	//@ts-expect-error
	async putById({ id, ...listData }) {
		return ListDao.updateListById(id, listData);
	}

	//@ts-expect-error
	async patchById({ id, ...listData }) {
		return ListDao.updateListById(id, listData);
	}

	async deleteById(id: string) {
		return ListDao.removeListById(id);
	}
}

export default new ListService();
