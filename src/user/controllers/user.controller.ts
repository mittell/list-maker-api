import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../../common/models/errorCode.model';
import { ErrorException } from '../../common/models/errorException.model';
import { UserToCreateDto } from '../dto/userToCreate.dto';
import { UserToReturnDto } from '../dto/userToReturn.dto';
import { UserToUpdateDto } from '../dto/userToUpdate.dto';
import UserService from '../services/user.service';

class UserController {
	async getUsers(_req: Request, res: Response, next: NextFunction) {
		let usersToReturn: UserToReturnDto[] = [];

		await UserService.list()
			.then((users) => {
				users.forEach((user) => {
					let userToAdd: UserToReturnDto = new UserToReturnDto();
					userToAdd.mapFromDocument(user);
					usersToReturn.push(userToAdd);
				});
				res.status(200).send(usersToReturn);
			})
			.catch((error) => {
				next(error);
			});
	}

	async getUserById(req: Request, res: Response, next: NextFunction) {
		try {
			const existingUser = await UserService.getById(req.body.id);

			if (!existingUser) {
				next(new ErrorException(ErrorCode.NotFound));
			}

			let userToReturn: UserToReturnDto = new UserToReturnDto();
			userToReturn.mapFromDocument(existingUser);

			res.status(200).send(userToReturn);
		} catch (error) {
			next(error);
		}
	}

	async createUser(req: Request, res: Response, next: NextFunction) {
		let userToCreate: UserToCreateDto = new UserToCreateDto();
		userToCreate.mapFromRequest(req.body);

		await UserService.create(req.body)
			.then((id) => {
				userToCreate.updateId(id);
				res.status(201).send({ id: userToCreate.getId() });
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchUser(req: Request, res: Response, next: NextFunction) {
		if (
			req.body.username === undefined &&
			req.body.email === undefined &&
			req.body.password === undefined
		) {
			next(new ErrorException(ErrorCode.ValidationError));
		}

		let userToUpdate: UserToUpdateDto = new UserToUpdateDto();
		userToUpdate.mapFromRequest(req.body);

		await UserService.patchById(userToUpdate.id, userToUpdate)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async putUser(req: Request, res: Response, next: NextFunction) {
		let userToUpdate: UserToUpdateDto = new UserToUpdateDto();
		userToUpdate.mapFromRequest(req.body);

		await UserService.putById(userToUpdate.id, userToUpdate)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	async removeUser(req: Request, res: Response, next: NextFunction) {
		const existingUser = await UserService.getById(req.body.id);

		if (!existingUser) {
			next(new ErrorException(ErrorCode.NotFound));
		}

		await UserService.deleteById(existingUser._id)
			.then(() => {
				res.status(204).send();
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new UserController();
