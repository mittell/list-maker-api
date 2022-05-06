import { Request, Response, NextFunction } from 'express';

export function extractListId(
	req: Request,
	_res: Response,
	next: NextFunction
): void {
	req.body.id = req.params.listId;
	next();
}
