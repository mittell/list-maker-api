// TODO - Review implementation... consider failed mapping?
export class ListItemToCreateDto {
	id!: string;
	title!: string;
	description!: string;
	isComplete!: Boolean;
	listId!: string;

	mapListItemFromRequest(body: any) {
		this.title = body.title;
		this.description = body.description;
		this.isComplete = body.isComplete;
		this.listId = body.listId;
	}

	updateId(id: string) {
		this.id = id;
	}

	getId(): string {
		return this.id;
	}
}
