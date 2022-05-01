// TODO - Review implementation... consider failed mapping?
export class ListToCreateDto {
	id!: string;
	title!: string;
	description!: string;
	userId!: string;

	mapListFromRequest(body: any) {
		this.title = body.title;
		this.description = body.description;
		this.userId = body.userId;
	}

	updateId(id: string) {
		this.id = id;
	}

	getId(): string {
		return this.id;
	}
}
