import { MappingError } from '../../common/types/error.type';

export class UserToReturnDto {
	id!: string;
	username!: string;
	email!: string;

	mapFromDocument(list: any) {
		let id = list._doc._id;
		let username = list.username;
		let email = list.email;

		if (
			id === null ||
			undefined ||
			'' ||
			username === null ||
			undefined ||
			'' ||
			email === null ||
			undefined ||
			''
		) {
			console.log('Unable to map User from Document');
			throw new MappingError('Unable to map User from Document');
		}

		this.id = id;
		this.username = username;
		this.email = email;
	}
}
