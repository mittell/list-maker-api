import { MappingError } from '../../common/types/error.type';

export class ListToReturnDto {
	id!: string;
	title!: string;
	description!: string;
	createdAt!: Date;
	updatedAt!: Date;
	listItems!: any[];

	mapFromDocument(list: any) {
		let id = list._doc._id;
		let title = list.title;
		let description = list.description;
		let createdAt = list.createdAt;
		let updatedAt = list.updatedAt;

		if (
			this.id === null ||
			undefined ||
			'' ||
			this.title === null ||
			undefined ||
			'' ||
			this.description === null ||
			undefined ||
			'' ||
			this.createdAt === null ||
			undefined ||
			'' ||
			this.updatedAt === null ||
			undefined ||
			''
		) {
			console.log('Unable to map List from Document');
			throw new MappingError('Unable to map List from Document');
		}

		this.id = id;
		this.title = title;
		this.description = description;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	mapListItemsFromDocument(listItems: any[]) {
		this.listItems = [];
		listItems.forEach((item) => {
			let itemId = item._doc._id;
			let itemTitle = item.title;
			let itemDescription = item.description;
			let itemIsComplete = item.isComplete;
			let itemCreatedAt = item.createdAt;
			let itemUpdatedAt = item.updatedAt;

			if (
				itemId === null ||
				undefined ||
				'' ||
				itemTitle === null ||
				undefined ||
				'' ||
				itemDescription === null ||
				undefined ||
				'' ||
				itemIsComplete === null ||
				undefined ||
				'' ||
				itemCreatedAt === null ||
				undefined ||
				'' ||
				itemUpdatedAt === null ||
				undefined ||
				''
			) {
				console.log('Unable to map ListItem to List from Document');
				throw new MappingError(
					'Unable to map ListItem to List from Document'
				);
			}

			this.listItems.push({
				id: itemId,
				title: itemTitle,
				description: itemDescription,
				isComplete: itemIsComplete,
				createdAt: itemCreatedAt,
				updatedAt: itemUpdatedAt,
			});
		});
	}
}
