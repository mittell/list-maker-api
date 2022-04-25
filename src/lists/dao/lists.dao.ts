import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';

class ListDao {
	Schema = mongooseService.getMongoose().Schema;

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
			// userId: {
			// 	type: String,
			// 	required: true,
			// },
		},
		{
			id: false,
			timestamps: true,
		}
	);

	List = mongooseService.getMongoose().model('List', this.listSchema);

	constructor() {
		console.log('Created a new instance of ListsDao');
	}

	async getLists(limit = 10, page = 0) {
		return this.List.find()
			.limit(limit)
			.skip(limit * page)
			.exec();
	}

	async getListById(listId: string) {
		return this.List.findOne({ _id: listId }).exec();
	}

	// Add CreateListDto here...
	// Add Guid Generation here...
	async addList(listData: any) {
		const listId = shortid.generate();
		const list = new this.List({
			_id: listId,
			...listData,
		});
		await list.save();
		return listId;
	}

	// Add UpdateListDto here...
	async updateListById(listId: string, listData: any) {
		const existingList = await this.List.findOneAndUpdate(
			{ _id: listId },
			{ $set: listData },
			{ new: true }
		).exec();

		return existingList;
	}

	async removeListById(listId: string) {
		return this.List.deleteOne({ _id: listId }).exec();
	}
}

export default new ListDao();
