import mongoose from 'mongoose';
import shortid from 'shortid';

class ListItemDao {
	Schema = mongoose.Schema;

	// TODO - Object only has a Mongoose Schema and no actual Class/Interface of its own!!! - Typegoose?
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
			// TODO - Do we want id set to false?
			id: false,
			timestamps: true,
		}
	);

	ListItem = mongoose.model('ListItem', this.listItemSchema);

	constructor() {}

	async getListItems() {
		return this.ListItem.find().exec();
	}

	async getListItemsByListId(listId: string) {
		return this.ListItem.find({ listId: listId }).exec();
	}

	async getListItemById(listItemId: string) {
		return this.ListItem.findOne({ _id: listItemId }).exec();
	}

	// TODO - Reference DTO here instead of any...
	async addListItem(listItemData: any) {
		const listItemId = shortid.generate();
		const listItem = new this.ListItem({
			_id: listItemId,
			...listItemData,
		});
		await listItem.save();
		return listItemId;
	}

	// TODO - Reference DTO here instead of any...
	async updateListItemById(listItemId: string, listItemData: any) {
		return this.ListItem.findOneAndUpdate(
			{ _id: listItemId },
			{ $set: listItemData },
			{ new: true }
		).exec();
	}

	async removeListItemById(listItemId: string) {
		return this.ListItem.deleteOne({ _id: listItemId }).exec();
	}
}

export default new ListItemDao();
