import { HttpStatusCodes } from './httpStatusCode.type';

export class UnauthorizedError extends Error {
	public readonly status: number;

	public constructor(message?: string) {
		super();
		this.status = HttpStatusCodes.Forbidden;
		this.name = this.constructor.name;
		this.message = message ? message : '';
	}
}

export class UnauthenticatedError extends Error {
	public readonly status: number;

	public constructor(message?: string) {
		super();
		this.status = HttpStatusCodes.Unauthorized;
		this.name = this.constructor.name;
		this.message = message ? message : '';
	}
}

export class InternalServerError extends Error {
	public readonly status: number;
	public error: any;

	public constructor(message?: string, error?: any) {
		super();
		this.status = HttpStatusCodes.InternalServerError;
		this.name = this.constructor.name;
		this.message = message ? message : '';
		this.error = error;
	}
}

export class BadRequestError extends Error {
	public readonly status: number;

	public constructor(message?: string) {
		super();
		this.status = HttpStatusCodes.BadRequest;
		this.name = this.constructor.name;
		this.message = message ? message : '';
	}
}

export class ValidationError extends Error {
	public errors: string[];
	public readonly status: number;

	public constructor(message?: string, error?: any) {
		super();

		this.status = HttpStatusCodes.UnprocessableEntity;
		this.name = this.constructor.name;
		this.message = message ? message : '';
		this.errors =
			error && Array.isArray(error) ? error.map((d: any) => d) : [];
	}
}

export class NotFoundError extends Error {
	public readonly status: number;

	public constructor(message?: string) {
		super();
		this.status = HttpStatusCodes.NotFound;
		this.name = this.constructor.name;
		this.message = message ? message : '';
	}
}

export class MappingError extends Error {
	public readonly status: number;

	public constructor(message?: string) {
		super();
		this.status = HttpStatusCodes.InternalServerError;
		this.name = this.constructor.name;
		this.message = message ? message : '';
	}
}
