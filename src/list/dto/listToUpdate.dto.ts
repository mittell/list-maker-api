import { MappingError } from '../../common/types/error.type';

export class ListToUpdateDto {
	id!: string;
	title!: string;
	description!: string;
	userId!: string;

	mapFromRequest(body: any) {
		let id = body.id;
		let title = body.title;
		let description = body.description;
		let userId = body.userId;

		if (
			id === null ||
			undefined ||
			'' ||
			title === null ||
			undefined ||
			'' ||
			description === null ||
			undefined ||
			'' ||
			userId === null ||
			undefined ||
			''
		) {
			console.log('Unable to map List from Request');
			throw new MappingError('Unable to map List from Request');
		}

		this.id = id;
		this.title = title;
		this.description = description;
		this.userId = userId;
	}
}
