import { NextFunction, Request, Response } from 'express';
import { ErrorModel } from '../models/error.model';
import { ErrorCode } from '../models/errorCode.model';
import { ErrorException } from '../models/errorException.model';

class ErrorHandlerMiddleware {
	async handleError(
		err: any,
		req: Request,
		res: Response,
		next: NextFunction
	) {
		// res.status(err.statusCode || 500).json({
		// 	success: false,
		// 	error: err.message || 'Internal Server Error',
		// });
		// next(err);

		console.log('Error handling middleware called.');
		console.log('Path:', req.path);
		console.error('Error occurred:', err);
		if (err instanceof ErrorException) {
			console.log('Error is known.');
			res.status(err.status).send(err);
		} else {
			res.status(500).send({
				code: ErrorCode.UnknownError,
				status: 500,
			} as ErrorModel);
		}

		next(err);
	}
}

export default new ErrorHandlerMiddleware();
