import { NextFunction, Request, Response } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

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
