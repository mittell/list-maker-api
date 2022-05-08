import { MappingError } from '../../common/types/error.type';

export class ListToCreateDto {
	id!: string;
	title!: string;
	description!: string;
	userId!: string;

	mapFromRequest(body: any) {
		let title = body.title;
		let description = body.description;
		let userId = body.userId;

		if (
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

		this.title = title;
		this.description = description;
		this.userId = userId;
	}
}
