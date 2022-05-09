import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../../config/env.config';
import crypto from 'crypto';
import { Jwt } from '../types/jwt.type';
import {
	BadRequestError,
	UnauthenticatedError,
	UnauthorizedError,
} from '../types/error.type';
import UserService from '../../user/services/user.service';

export function validateJsonWebToken() {
	return async (req: Request, _res: Response, next: NextFunction) => {
		if (req.headers['authorization']) {
			try {
				const authorization = req.headers['authorization'].split(' ');

				if (authorization[0] !== 'Bearer') {
					return next(new UnauthenticatedError());
				} else {
					//@ts-expect-error
					req.body.jwt = jwt.verify(
						//@ts-expect-error
						authorization[1],
						env.JWT_SECRET
					) as Jwt;
					return next();
				}
			} catch (err) {
				return next(new UnauthorizedError());
			}
		} else {
			return next(new UnauthenticatedError());
		}
	};
}

export function validateRefreshToken() {
	return async (req: Request, _res: Response, next: NextFunction) => {
		const user: any = await UserService.getUserByEmailWithPassword(
			req.body.jwt.email
		);

		const salt = crypto.createSecretKey(
			Buffer.from(req.body.jwt.refreshKey.data)
		);

		const hash = crypto
			.createHmac('sha512', salt)
			.update(req.body.jwt.userId + env.JWT_SECRET)
			.digest('base64');

		if (hash === req.body.refreshToken) {
			req.body = {
				userId: user._id,
				email: user.email,
				username: user.username,
			};
			return next();
		} else {
			return next(new BadRequestError());
		}
	};
}

export function validateRefreshBody() {
	return async (req: Request, _res: Response, next: NextFunction) => {
		if (req.body && req.body.refreshToken) {
			return next();
		} else {
			return next(new BadRequestError());
		}
	};
}
