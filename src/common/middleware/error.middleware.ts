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
		console.log('ErrorHandlerMiddleware called...');
		if (error instanceof ErrorException) {
			res.status(error.status).send({
				errorType: 'ErrorException',
				errorDetails: error.message,
			} as ErrorModel);
		} else if (error instanceof MongooseError.ValidationError) {
			const messages = Object.values(error.errors).map((e) => e.message);
			res.status(400).send({
				errorType: 'MongooseError.ValidationError',
				errorDetails: messages,
			} as ErrorModel);
		} else if (error instanceof MongoError) {
			res.status(400).send({
				errorType: 'MongoError',
				errorDetails: error,
			} as ErrorModel);
		} else {
			res.status(500).send({
				errorType: ErrorCode.UnknownError,
			} as ErrorModel);
		}

		next(error);
	}
}

export default new ErrorHandlerMiddleware();
