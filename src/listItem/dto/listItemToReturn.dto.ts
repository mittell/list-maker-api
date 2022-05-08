import { MappingError } from '../../common/types/error.type';

export class ListItemToReturnDto {
	id!: string;
	title!: string;
	description!: string;
	isComplete!: Boolean;
	listId!: string;

	mapFromDocument(list: any) {
		let id = list._doc._id;
		let title = list.title;
		let description = list.description;
		let isComplete = list.isComplete;
		let listId = list.listId;

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
			console.log('Unable to map ListItem from Document');
			throw new MappingError('Unable to map ListItem from Document');
		}

		this.id = id;
		this.title = title;
		this.description = description;
		this.isComplete = isComplete;
		this.listId = listId;
	}
}
