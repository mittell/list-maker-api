// TODO - Review implementation... consider failed mapping?
export class ListItemToUpdateDto {
	id!: string;
	title!: string;
	description!: string;
	isComplete!: Boolean;
	listId!: string;

	mapListItemFromRequest(body: any) {
		this.id = body.id;
		this.title = body.title;
		this.description = body.description;
		this.isComplete = body.isComplete;
		this.listId = body.listId;
	}
}
