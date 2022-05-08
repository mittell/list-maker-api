import { MappingError } from '../../common/types/error.type';

export class UserToCreateDto {
	id!: string;
	username!: string;
	email!: string;
	password!: string;

	mapFromRequest(body: any) {
		let username = body.username;
		let email = body.email;
		let password = body.password;

		if (
			username === null ||
			undefined ||
			'' ||
			email === null ||
			undefined ||
			'' ||
			password === null ||
			undefined ||
			''
		) {
			console.log('Unable to map User from Request');
			throw new MappingError('Unable to map User from Request');
		}

		this.username = username;
		this.email = email;
		this.password = password;
	}
}
