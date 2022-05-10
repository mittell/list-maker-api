import { MappingError } from '../../common/types/error.type';

export class ListItemToUpdateDto {
	id!: string;
	title!: string;
	description!: string;
	isComplete!: Boolean;
	listId!: string;
	userId!: string;

	mapFromRequest(body: any) {
		let id = body.id;
		let title = body.title;
		let description = body.description;
		let isComplete = body.isComplete;
		let listId = body.listId;

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

		this.id = id;
		this.title = title;
		this.description = description;
		this.isComplete = isComplete;
		this.listId = listId;
	}
}
