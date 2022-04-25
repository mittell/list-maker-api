import mongoose from 'mongoose';
import config from '../../config';
import * as Sentry from '@sentry/node';

class MongooseService {
	private retrySeconds = 5;
	private mongooseOptions = {
		serverSelectionTimeoutMS: 5000,
	};

	constructor() {
		this.connectWithRetry();
	}

	getMongoose() {
		return mongoose;
	}

	connectWithRetry = () => {
		console.log('Attempting MongoDB connection...');
		mongoose
			.connect(config.MONGO_URL, this.mongooseOptions)
			.then(() => {
				console.log('MongoDB successfully connected!');
			})
			.catch((error) => {
				console.log(
					`MongoDB connection was unsuccessful... will retry after ${this.retrySeconds} seconds:`,
					error
				);
				Sentry.captureException(error);
				setTimeout(this.connectWithRetry, this.retrySeconds * 1000);
			});
	};
}

export default new MongooseService();
