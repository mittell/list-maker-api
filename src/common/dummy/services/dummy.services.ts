import { injectable } from 'inversify';
import 'reflect-metadata';

import { IService } from '../../interfaces/service.interface';

@injectable()
export class DummyService implements IService {
	async run(): Promise<any> {
		const test = new Promise<string>((resolve, _reject) => {
			resolve('Hello');
		});

		return test;
	}
}
