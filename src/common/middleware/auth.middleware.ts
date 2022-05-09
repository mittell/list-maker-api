import { NextFunction, Request, Response } from 'express';
import UserService from '../../user/services/user.service';
import argon2 from 'argon2';
import { UnauthenticatedError } from '../types/error.type';

export function verifyUserPassword() {
	return async (req: Request, _res: Response, next: NextFunction) => {
		const user: any = await UserService.getUserByEmailWithPassword(
			req.body.email
		);
		if (user) {
			const passwordHash = user.password;
			if (await argon2.verify(passwordHash, req.body.password)) {
				req.body = {
					userId: user._id,
					email: user.email,
					username: user.username,
					password: user.password,
				};
				return next();
			}
		}

		next(new UnauthenticatedError());
	};
}

export function verifyUserRequest() {
	return async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.body.id;

		const user = await UserService.getById(userId);

		if (user) {
			if (userId === res.locals.jwt.userId) {
				return next();
			}
		}
		next(new UnauthenticatedError());
	};
}
