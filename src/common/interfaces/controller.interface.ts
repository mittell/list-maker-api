import { Request, Response } from 'express';

export interface IController {
	getById(id: string, req: Request, res: Response): Promise<any>;
	getAll(req: Request, res: Response): Promise<any>;
}
