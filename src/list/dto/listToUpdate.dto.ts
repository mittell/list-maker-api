export class ListToUpdateDto {
	id!: string;
	title!: string;
	description!: string;
	userId!: string;

	mapListFromRequest(body: any) {
		this.id = body.id;
		this.title = body.title;
		this.description = body.description;
		this.userId = body.userId;
	}
}
