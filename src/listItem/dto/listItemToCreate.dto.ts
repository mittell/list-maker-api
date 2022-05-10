import { MappingError } from '../../common/types/error.type';

export class ListItemToCreateDto {
	id!: string;
	title!: string;
	description!: string;
	isComplete!: Boolean;
	listId!: string;
	userId!: string;

	mapFromRequest(body: any) {
		let title = body.title;
		let description = body.description;
		let isComplete = body.isComplete;
		let listId = body.listId;

		if (
			title === null ||
			undefined ||
			'' ||
			description === null ||
			undefined ||
			'' ||
			isComplete === null ||
			undefined ||
			'' ||
			listId === null ||
			undefined ||
			''
		) {
			console.log('Unable to map ListItem from Request');
			throw new MappingError('Unable to map ListItem from Request');
		}

		this.title = title;
		this.description = description;
		this.isComplete = isComplete;
		this.listId = listId;
	}
}
