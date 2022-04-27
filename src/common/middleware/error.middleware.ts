import { NextFunction, Request, Response } from 'express';
import { ErrorModel } from '../models/error.model';
import { ErrorCode } from '../models/errorCode.model';
import { ErrorException } from '../models/errorException.model';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import * as Sentry from '@sentry/node';
import { Result as ValidationError } from 'express-validator';

class ErrorHandlerMiddleware {
	async handleError(
		error: any,
		_req: Request,
		res: Response,
		next: NextFunction
	) {
		// switch (error.constructor) {
		// 	case ErrorException:
		// 		console.log('ErrorException');
		// 		break;
		// 	case ValidationError:
		// 		console.log('ValidationError');
		// 		break;
		// 	case MongooseError.ValidationError:
		// 		console.log('MongooseError.ValidationError');
		// 		break;
		// 	case MongoError:
		// 		console.log('MongoError');
		// 		break;
		// 	default:
		// 		console.log('UnknownError');
		// 		break;
		// }

		if (error instanceof ErrorException) {
			res.status(error.status).send({
				errorType: 'Error',
				errorDetails: error.message,
			} as ErrorModel);
		} else if (error instanceof ValidationError) {
			res.status(406).send({
				errorType: ErrorCode.ValidationError,
				errorDetails: error.array(),
			} as ErrorModel);
		} else if (error instanceof MongooseError.ValidationError) {
			const messages = Object.values(error.errors).map((e) => e.message);
			res.status(406).send({
				errorType: ErrorCode.ValidationError,
				errorDetails: messages,
			} as ErrorModel);
		} else if (error instanceof MongoError) {
			res.status(500).send({
				errorType: 'Error',
				errorDetails: error,
			} as ErrorModel);
		} else {
			res.status(500).send({
				errorType: ErrorCode.UnknownError,
			} as ErrorModel);
		}

		Sentry.captureException(error);
		next(error);
	}
}

export default new ErrorHandlerMiddleware();
