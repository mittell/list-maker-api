import { Request, Response, NextFunction } from 'express';

export function extractUserId(
	req: Request,
	_res: Response,
	next: NextFunction
): void {
	req.body.id = req.params.userId;
	next();
}
