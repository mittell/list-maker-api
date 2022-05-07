// TODO - Review implementation... consider failed mapping?
export class UserToReturnDto {
	id!: string;
	username!: string;
	email!: string;

	mapFromDocument(list: any) {
		this.id = list._doc._id;
		this.username = list.username;
		this.email = list.email;
	}
}
