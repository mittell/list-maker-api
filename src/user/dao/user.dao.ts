import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';

class UserDao {
	Schema = mongooseService.getMongoose().Schema;

	// TODO - Object only has a Mongoose Schema and no actual Class/Interface of its own!!! - Typegoose?
	userSchema = new this.Schema(
		{
			_id: String,
			username: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			password: {
				type: String,
				required: true,
				min: 6,
			},
		},
		{
			// TODO - Do we want id set to false?
			id: false,
			timestamps: true,
		}
	);

	User = mongooseService.getMongoose().model('User', this.userSchema);

	constructor() {
		console.log('Created a new instance of UserDao');
	}

	async getUsers() {
		return this.User.find().exec();
	}

	async getUserById(userId: string) {
		return this.User.findOne({ _id: userId }).exec();
	}

	// TODO - Reference DTO here instead of any...
	async addUser(userData: any) {
		const userId = shortid.generate();
		const User = new this.User({
			_id: userId,
			...userData,
		});
		await User.save();
		return userId;
	}

	// TODO - Reference DTO here instead of any...
	async updateUserById(userId: string, userData: any) {
		return this.User.findOneAndUpdate(
			{ _id: userId },
			{ $set: userData },
			{ new: true }
		).exec();
	}

	async removeUserById(userId: string) {
		return this.User.deleteOne({ _id: userId }).exec();
	}
}

export default new UserDao();
