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
				};
				return next();
			}
		}

		return next(new UnauthenticatedError());
	};
}

export function verifyUserRequest() {
	return async (req: Request, _res: Response, next: NextFunction) => {
		const requestUserId = req.params.userId;

		if (requestUserId === req.body.jwt.userId) {
			return next();
		}

		return next(new UnauthenticatedError());
	};
}
