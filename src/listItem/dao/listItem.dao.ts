import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';

class ListItemDao {
	Schema = mongooseService.getMongoose().Schema;

	listItemSchema = new this.Schema(
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
			isComplete: {
				type: Boolean,
				default: false,
			},
			listId: {
				type: String,
				required: true,
			},
		},
		{
			id: false,
			timestamps: true,
		}
	);

	ListItem = mongooseService
		.getMongoose()
		.model('ListItem', this.listItemSchema);

	constructor() {
		console.log('Created a new instance of ListItemDao');
	}

	async getListItems() {
		return this.ListItem.find().exec();
	}

	async getListItemById(listItemId: string) {
		return this.ListItem.findOne({ _id: listItemId }).exec();
	}

	// Add CreateListItemDto here...
	async addListItem(listItemData: any) {
		const listItemId = shortid.generate();
		const listItem = new this.ListItem({
			_id: listItemId,
			...listItemData,
		});
		await listItem.save();
		return listItemId;
	}

	// Add UpdateListItemDto here...
	async updateListItemById(listItemId: string, listItemData: any) {
		const existingListItem = await this.ListItem.findOneAndUpdate(
			{ _id: listItemId },
			{ $set: listItemData },
			{ new: true }
		).exec();

		return existingListItem;
	}

	async removeListItemById(listItemId: string) {
		return this.ListItem.deleteOne({ _id: listItemId }).exec();
	}
}

export default new ListItemDao();
