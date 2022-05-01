// TODO - Review implementation... consider failed mapping?
export class UserToCreateDto {
	id!: string;
	username!: string;
	email!: string;
	password!: string;

	mapFromRequest(body: any) {
		this.username = body.username;
		this.email = body.email;
		this.password = body.password;
	}

	updateId(id: string) {
		this.id = id;
	}

	getId(): string {
		return this.id;
	}
}
