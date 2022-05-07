import mongoose from 'mongoose';
import shortid from 'shortid';

class ListDao {
	Schema = mongoose.Schema;

	// TODO - Object only has a Mongoose Schema and no actual Class/Interface of its own!!! - Typegoose?
	listSchema = new this.Schema(
		{
			_id: String,
			title: {
				type: String,
				required: true,
			},
			description: {
				type: String,
				required: true,
			},
			userId: {
				type: String,
				required: true,
			},
		},
		{
			// TODO - Do we want id set to false?
			id: false,
			timestamps: true,
		}
	);

	List = mongoose.model('List', this.listSchema);

	constructor() {}

	// TODO - Set limit and page defaults elsewhere?
	async getLists(limit = 10, page = 0) {
		return this.List.find()
			.limit(limit)
			.skip(limit * page)
			.exec();
	}

	async getListById(listId: string) {
		return this.List.findOne({ _id: listId }).exec();
	}

	// TODO - Reference DTO here instead of any...
	async addList(listData: any) {
		const listId = shortid.generate();
		const list = new this.List({
			_id: listId,
			...listData,
		});
		await list.save();
		return listId;
	}

	// TODO - Reference DTO here instead of any...
	async updateListById(listId: string, listData: any) {
		return this.List.findOneAndUpdate(
			{ _id: listId },
			{ $set: listData },
			{ new: true }
		).exec();
	}

	async removeListById(listId: string) {
		return this.List.deleteOne({ _id: listId }).exec();
	}
}

export default new ListDao();
