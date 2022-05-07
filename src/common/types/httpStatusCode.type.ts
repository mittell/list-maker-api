// TODO - Consider Mongoose/Mongo Error and Status Codes?

export enum HttpStatusCodes {
	OK = 200,
	Created = 201,
	Accepted = 202,
	NoContent = 204,

	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	MethodNotAllowed = 405,
	NotAcceptable = 406,
	UnprocessableEntity = 422,

	InternalServerError = 500,
	NotImplemented = 501,
	BadGateway = 502,
}
