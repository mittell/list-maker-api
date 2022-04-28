export class UserToUpdateDto {
	id!: string;
	username!: string;
	email!: string;
	password!: string;

	mapFromRequest(body: any) {
		this.id = body.id;
		this.username = body.username;
		this.email = body.email;
		this.password = body.password;
	}
}
