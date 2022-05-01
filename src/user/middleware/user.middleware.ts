// TODO - Review implementation and potential duplication...
import { Request, Response, NextFunction } from 'express';

class UserMiddleware {
	async extractUserId(req: Request, _res: Response, next: NextFunction) {
		req.body.id = req.params.userId;
		next();
	}
}

export default new UserMiddleware();
