export class ListItemToReturnDto {
	id!: string;
	title!: string;
	description!: string;
	isComplete!: Boolean;
	listId!: string;

	mapFromDocument(list: any) {
		this.id = list._id;
		this.title = list.title;
		this.description = list.description;
		this.isComplete = list.isComplete;
		this.listId = list.listId;
	}
}
