import { NextFunction, Request, Response } from 'express';
import { ErrorModel } from '../models/error.model';
import { ErrorCode } from '../models/errorCode.model';
import { ErrorException } from '../models/errorException.model';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';

class ErrorHandlerMiddleware {
	async handleError(
		error: any,
		_req: Request,
		res: Response,
		next: NextFunction
	) {
		// res.status(err.statusCode || 500).json({
		// 	success: false,
		// 	error: err.message || 'Internal Server Error',
		// });
		// next(err);

		console.log('Error handling middleware called.');
		console.error('Error occurred:', error);
		if (error instanceof ErrorException) {
			console.log('ErrorException');
			res.status(error.status).send(error);
		} else if (error instanceof MongooseError.ValidationError) {
			const messages = Object.values(error.errors).map((e) => e.message);
			res.status(400).json({
				success: false,
				message: 'MongooseError.ValidationError',
				error: messages,
			});
		} else if (error instanceof MongoError) {
			res.status(400).json({
				success: false,
				message: 'MongoError',
				error: error,
			});
		} else {
			res.status(500).send({
				code: ErrorCode.UnknownError,
				status: 500,
			} as ErrorModel);
		}

		next(error);
	}
}

export default new ErrorHandlerMiddleware();
