import env from '../../config/env.config';
import { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { ProcessEnv } from '../types/env.type';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import { Result as ExpressValidatorError } from 'express-validator';
import {
	BadRequestError,
	InternalServerError,
	UnauthenticatedError,
	UnauthorizedError,
	ValidationError,
	MappingError,
	NotFoundError,
} from '../types/error.type';

export function handleInvalidUrl(req: Request, res: Response): void {
	res.status(404).json({
		status: 404,
		message: 'Invalid route.',
		...(req.method ? { request: req.method } : {}),
		...(req.path ? { path: req.path } : {}),
	});
}

export function handleErrors(
	error: any,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	if (env.NODE_ENV === ProcessEnv.DEV) {
		Sentry.captureException(error);
	}

	if (
		error instanceof UnauthorizedError ||
		error instanceof UnauthenticatedError ||
		error instanceof BadRequestError ||
		error instanceof MappingError
	) {
		res.status(error.status).json({
			status: error.status,
			name: error.name,
			...(error.message ? { message: error.message } : {}),
		});
	} else if (error instanceof InternalServerError) {
		res.status(error.status).json({
			status: error.status,
			name: error.name,
			...(error.message ? { message: error.message } : {}),
			...(error.error && env.NODE_ENV === ProcessEnv.DEV
				? { error: error.error }
				: {}),
		});
	} else if (error instanceof ValidationError) {
		res.status(error.status).json({
			status: error.status,
			name: error.name,
			...(error.message ? { message: error.message } : {}),
			...(error.errors.length ? { details: error.errors } : {}),
		});
	} else if (error instanceof ExpressValidatorError) {
		res.status(406).json({
			status: 406,
			name: 'ExpressValidatorError',
			message: [
				...new Set(
					error
						.array()
						.map((e) =>
							e.param === '' ? `${e.msg}` : `${e.param}: ${e.msg}`
						)
				),
			],
		});
	} else if (error instanceof MongooseError.ValidationError) {
		res.status(406).json({
			status: 406,
			name: error.name,
			...(error.message
				? { message: Object.values(error.errors).map((e) => e.message) }
				: {}),
		});
	} else if (error instanceof MongoError) {
		res.status(500).json({
			status: 500,
			name: error.name,
			...(error.message ? { message: error.message } : {}),
			...(env.NODE_ENV === ProcessEnv.DEV ? { error } : {}),
		});
	} else if (error instanceof SyntaxError) {
		res.status(406).json({
			status: 406,
			name: error.name,
			...(error.message ? { message: 'Invalid JSON content' } : {}),
			// ...(env.NODE_ENV === ProcessEnv.DEV ? { error } : {}),
		});
	} else if (error instanceof NotFoundError) {
		res.status(404).json({
			status: 404,
			name: error.name,
			message: 'Not Found',
		});
	} else {
		res.status(error.status || 500).json({
			status: error.status || 500,
			name: error.name,
			message: 'Unhandled internal server error',
			...(env.NODE_ENV === ProcessEnv.DEV ? { error } : {}),
		});
	}
}
