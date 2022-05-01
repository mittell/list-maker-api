// TODO - Review implementation... consider failed mapping?
export class ListToReturnDto {
	id!: string;
	title!: string;
	description!: string;
	createdAt!: Date;
	updatedAt!: Date;
	listItems!: any[];
	page!: number;
	limit!: number;

	mapListFromDocument(list: any) {
		this.id = list._id;
		this.title = list.title;
		this.description = list.description;
		this.createdAt = list.createdAt;
		this.updatedAt = list.updatedAt;
	}

	mapListItemsFromDocument(listItems: any[]) {
		this.listItems = [];
		listItems.forEach((item) => {
			this.listItems.push({
				id: item._id,
				title: item.title,
				description: item.description,
				isComplete: item.isComplete,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			});
		});
	}

	updatePageLimit(page: number, limit: number) {
		this.page = page;
		this.limit = limit;
	}
}
