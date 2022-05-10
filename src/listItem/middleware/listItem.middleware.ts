import { Request, Response, NextFunction } from 'express';

export function extractListItemId(
	req: Request,
	_res: Response,
	next: NextFunction
): void {
	req.body.id = req.params.listItemId;
	next();
}
