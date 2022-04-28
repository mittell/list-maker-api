import UserDao from '../dao/user.dao';
import { CRUD } from '../../common/interfaces/crud.interface';

class UserService implements CRUD {
	async list() {
		return UserDao.getUsers();
	}

	async getById(id: string) {
		return UserDao.getUserById(id);
	}

	// Add CreateUserDto here...
	async create(userData: any) {
		return UserDao.addUser(userData);
	}

	// Add UpdateUserDto here...
	async putById(id: string, userData: any) {
		return UserDao.updateUserById(id, userData);
	}

	// Add UpdateUserDto here...
	async patchById(id: string, userData: any) {
		return UserDao.updateUserById(id, userData);
	}

	async deleteById(id: string) {
		return UserDao.removeUserById(id);
	}
}

export default new UserService();
