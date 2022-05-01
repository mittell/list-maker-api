// TODO - Review implementation and potential duplication...
import express from 'express';

class ListItemMiddleware {
	async extractListItemId(
		req: express.Request,
		_res: express.Response,
		next: express.NextFunction
	) {
		req.body.id = req.params.listItemId;
		next();
	}
}

export default new ListItemMiddleware();
