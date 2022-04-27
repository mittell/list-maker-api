import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';

class UserController {
	async getUsers(_req: Request, res: Response, next: NextFunction) {
		await UserService.list()
			.then((users) => {
				res.status(200).send(users);
			})
			.catch((error) => {
				next(error);
			});
	}

	async getUserById(req: Request, res: Response, next: NextFunction) {
		await UserService.getById(req.body.id)
			.then((user) => {
				res.status(200).send(user);
			})
			.catch((error) => {
				next(error);
			});
	}

	async createUser(req: Request, res: Response, next: NextFunction) {
		await UserService.create(req.body)
			.then((id) => {
				res.status(201).send({ id });
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchUser(req: Request, res: Response, next: NextFunction) {
		await UserService.patchById(req.body.id, req.body)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async putUser(req: Request, res: Response, next: NextFunction) {
		await UserService.putById(req.body.id, req.body)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async removeUser(req: Request, res: Response, next: NextFunction) {
		await UserService.deleteById(req.body.id)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new UserController();
