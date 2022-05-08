import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../common/types/error.type';
import { UserToCreateDto } from '../dto/userToCreate.dto';
import { UserToReturnDto } from '../dto/userToReturn.dto';
import { UserToUpdateDto } from '../dto/userToUpdate.dto';
import UserService from '../services/user.service';

class UserController {
	// TODO - Exposed endpoint needs to be removed!
	async getUsers(_req: Request, res: Response, next: NextFunction) {
		await UserService.list()
			.then((users) => {
				let usersToReturn: UserToReturnDto[] = [];
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

	// TODO - Endpoint will need authentication, so only the user can get their own details?
	async getUserById(req: Request, res: Response, next: NextFunction) {
		let userId = req.body.id;

		await UserService.getById(userId)
			.then((existingUser) => {
				if (!existingUser) {
					next(new NotFoundError());
				}

				let userToReturn: UserToReturnDto = new UserToReturnDto();
				userToReturn.mapFromDocument(existingUser);

				res.status(200).send(userToReturn);
			})
			.catch((error) => {
				next(error);
			});
	}

	async createUser(req: Request, res: Response, next: NextFunction) {
		let userToCreate: UserToCreateDto = new UserToCreateDto();

		userToCreate.mapFromRequest(req.body);

		// TODO - Password generation and hashing needed to happen here!!!

		await UserService.create(req.body)
			.then((id) => {
				userToCreate.id = id;
				res.status(201).send({ id: userToCreate.id });
			})
			.catch((error) => {
				next(error);
			});
	}

	// TODO - Endpoint will need authentication, so only the user can get update own details?
	async patchUser(req: Request, res: Response, next: NextFunction) {
		let userToUpdate: UserToUpdateDto = new UserToUpdateDto();

		userToUpdate.mapFromRequest(req.body);

		// TODO - Password hashing needed to happen here!!!

		await UserService.patchById(userToUpdate)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	// TODO - Endpoint will need authentication, so only the user can get update own details?
	async putUser(req: Request, res: Response, next: NextFunction) {
		let userToUpdate: UserToUpdateDto = new UserToUpdateDto();

		userToUpdate.mapFromRequest(req.body);

		// TODO - Password hashing needed to happen here!!!

		await UserService.putById(userToUpdate)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

	// TODO - Exposed endpoint needs to be removed???
	async removeUser(req: Request, res: Response, next: NextFunction) {
		let userId = req.body.id;

		await UserService.getById(userId)
			.then(async (existingUser) => {
				if (!existingUser) {
					next(new NotFoundError());
				}

				//@ts-expect-error
				await UserService.deleteById(existingUser._id).then(() => {
					res.status(204).send();
				});
			})
			.catch((error) => {
				next(error);
			});
	}
}

export default new UserController();
