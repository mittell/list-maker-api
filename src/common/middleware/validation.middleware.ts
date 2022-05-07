import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../types/error.type';

export function validateRequest(validations: ValidationChain[]) {
	return async (req: Request, _res: Response, next: NextFunction) => {
		await Promise.all(
			validations.map((validation: ValidationChain) =>
				validation.run(req)
			)
		);

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}
		return next(errors);
	};
}

export function validateBody() {
	return async (req: Request, _res: Response, next: NextFunction) => {
		const body = req.body;

		if (
			(body.constructor === Object && Object.keys(body).length === 0) ||
			(Object.keys(body).length === 1 && body['id'] !== undefined)
		) {
			return next(
				new ValidationError('ValidationError', [
					'Body cannot be empty.',
				])
			);
		}

		next();
	};
}
