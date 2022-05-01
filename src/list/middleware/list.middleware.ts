// TODO - Review implementation and potential duplication...
import express from 'express';

class ListMiddleware {
	async extractListId(
		req: express.Request,
		_res: express.Response,
		next: express.NextFunction
	) {
		req.body.id = req.params.listId;
		next();
	}
}

export default new ListMiddleware();
