import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import shortid from 'shortid';

@modelOptions({
	schemaOptions: {
		_id: true,
		timestamps: true,
		toObject: { virtuals: true },
	},
})
class User {
	@prop()
	public _id!: string;

	@prop({ type: () => String, required: true })
	public username!: string;

	@prop({ type: () => String, required: true })
	public email!: string;

	@prop({ type: () => String, required: true })
	public password!: string;
}

class UserDao {
	UserModel = getModelForClass(User);

	constructor() {}

	async getUsers() {
		return this.UserModel.find().exec();
	}

	async getUserById(userId: string) {
		return await this.UserModel.findOne({ _id: userId }).exec();
	}

	async addUser(userData: any) {
		const userId = shortid.generate();
		const User = new this.UserModel({
			_id: userId,
			...userData,
		});
		await User.save();
		return userId;
	}

	async updateUserById(userId: string, userData: any) {
		return this.UserModel.findOneAndUpdate(
			{ _id: userId },
			{ $set: userData },
			{ new: true }
		).exec();
	}

	async removeUserById(userId: string) {
		return this.UserModel.deleteOne({ _id: userId }).exec();
	}
}

export default new UserDao();
