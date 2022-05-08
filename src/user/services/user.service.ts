import UserDao from '../dao/user.dao';
import { IService } from '../../common/interfaces/service.interface';

class UserService implements IService {
	async list() {
		return UserDao.getUsers();
	}

	async getById(id: string) {
		return UserDao.getUserById(id);
	}

	async create(userData: any) {
		return UserDao.addUser(userData);
	}

	//@ts-expect-error
	async putById({ id, ...userData }) {
		return UserDao.updateUserById(id, userData);
	}

	//@ts-expect-error
	async patchById({ id, ...userData }) {
		return UserDao.updateUserById(id, userData);
	}

	async deleteById(id: string) {
		return UserDao.removeUserById(id);
	}
}

export default new UserService();
