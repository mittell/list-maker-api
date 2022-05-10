import ListDao from '../dao/list.dao';
import { IService } from '../../common/interfaces/service.interface';

class ListService implements IService {
	async list(limit: number, page: number) {
		return ListDao.getLists(limit, page);
	}

	async listByUserId(limit: number, page: number, userId: string) {
		return ListDao.getListsByUserId(limit, page, userId);
	}

	async getById(id: string) {
		return ListDao.getListById(id);
	}

	async getByIdAndUserId(id: string, userId: string) {
		return ListDao.getListByIdAndUserId(id, userId);
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
