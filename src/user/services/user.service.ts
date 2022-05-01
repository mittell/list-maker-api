import UserDao from '../dao/user.dao';
import { CRUD } from '../../common/interfaces/crud.interface';

class UserService implements CRUD {
	async list() {
		return UserDao.getUsers();
	}

	async getById(id: string) {
		return UserDao.getUserById(id);
	}

	// TODO - Reference DTO here instead of any...
	async create(userData: any) {
		return UserDao.addUser(userData);
	}

	// TODO - Reference DTO here instead of any...
	async putById(id: string, userData: any) {
		return UserDao.updateUserById(id, userData);
	}

	// TODO - Reference DTO here instead of any...
	async patchById(id: string, userData: any) {
		return UserDao.updateUserById(id, userData);
	}

	async deleteById(id: string) {
		return UserDao.removeUserById(id);
	}
}

export default new UserService();
