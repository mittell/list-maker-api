import { Request, Response, NextFunction } from 'express';

export function extractListId(
	req: Request,
	_res: Response,
	next: NextFunction
): void {
	req.body.id = req.params.listId;
	next();
}

export function extractPageLimit(
	req: Request,
	_res: Response,
	next: NextFunction
): void {
	req.body.page = parseInt(req.query.page as string);
	req.body.limit = parseInt(req.query.limit as string);
	next();
}

export function extractListItems(
	req: Request,
	_res: Response,
	next: NextFunction
): void {
	req.body.listItems = req.query.listItems as string;

	if (req.body.listItems) {
		req.body.listItems.toLowerCase();
	}
	next();
}
