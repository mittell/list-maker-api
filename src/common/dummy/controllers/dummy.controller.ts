import { inject } from 'inversify';
import 'reflect-metadata';
import {
	controller,
	httpGet,
	request,
	response,
	requestParam,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { TYPES } from '../../types/di.type';
import { IController } from '../../interfaces/controller.interface';
import { IService } from '../../interfaces/service.interface';

@controller('/dummy')
export class DummyController implements IController {
	private _service: IService;

	public constructor(@inject(TYPES.IService) service: IService) {
		this._service = service;
	}

	@httpGet('/')
	async getAll(
		@request() _req: Request,
		@response() res: Response
	): Promise<any> {
		console.log(`getAll`);
		let data = await this._service.run();
		res.status(200).json({
			data,
		});
	}

	@httpGet('/:id')
	async getById(
		@requestParam('id') id: string,
		@request() _req: Request,
		@response() res: Response
	): Promise<any> {
		console.log(`getById`);
		console.log(`ID is ${id}`);
		let data = await this._service.run();
		res.status(200).json({
			data,
			id,
		});
	}
}
