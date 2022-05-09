import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../common/types/error.type';
import { UserToCreateDto } from '../dto/userToCreate.dto';
import { UserToReturnDto } from '../dto/userToReturn.dto';
import { UserToUpdateDto } from '../dto/userToUpdate.dto';
import UserService from '../services/user.service';
import argon2 from 'argon2';
import { env } from 'process';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

class UserController {
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

		userToCreate.password = await argon2.hash(userToCreate.password);

		await UserService.create(userToCreate)
			.then((id) => {
				userToCreate.id = id;
				res.status(201).send({ id: userToCreate.id });
			})
			.catch((error) => {
				next(error);
			});
	}

	async patchUser(req: Request, res: Response, next: NextFunction) {
		let userToUpdate: UserToUpdateDto = new UserToUpdateDto();

		userToUpdate.mapFromRequest(req.body);

		if (req.body.password) {
			userToUpdate.password = await argon2.hash(userToUpdate.password);
		}

		await UserService.patchById(userToUpdate)
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

		userToUpdate.password = await argon2.hash(userToUpdate.password);

		await UserService.putById(userToUpdate)
			.then(() => {
				res.status(202).send();
			})
			.catch((error) => {
				next(error);
			});
	}

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

	//@ts-expect-error
	async generateJsonWebToken(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const tokenExpirationInSeconds = 36000;
		try {
			const refreshId = req.body.userId + env.JWT_SECRET;
			const salt = crypto.createSecretKey(crypto.randomBytes(16));
			const hash = crypto
				.createHmac('sha512', salt)
				.update(refreshId)
				.digest('base64');
			req.body.refreshKey = salt.export();
			//@ts-ignore
			const token = jwt.sign(req.body, env.JWT_SECRET, {
				expiresIn: tokenExpirationInSeconds,
			});
			return res
				.status(201)
				.send({ accessToken: token, refreshToken: hash });
		} catch (error) {
			console.log('generateJsonWebToken Error');
			next(error);
		}
	}
}

export default new UserController();
