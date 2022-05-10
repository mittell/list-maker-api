import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import shortid from 'shortid';

@modelOptions({
	schemaOptions: {
		_id: true,
		timestamps: true,
		toObject: { virtuals: true },
	},
})
class ListItem {
	@prop()
	public _id!: string;

	@prop({ type: () => String, required: true })
	public title!: string;

	@prop({ type: () => String, required: true })
	public description!: string;

	@prop({ type: () => Boolean, default: false })
	public isComplete!: string;

	@prop({ type: () => String, required: true })
	public listId!: string;

	@prop({ type: () => String, required: true })
	public userId!: string;
}

class ListItemDao {
	ListItemModel = getModelForClass(ListItem);

	constructor() {}

	async getListItems() {
		return this.ListItemModel.find().exec();
	}

	async getListItemsByUserId(userId: string) {
		return this.ListItemModel.find({ userId: userId }).exec();
	}

	async getListItemsByListId(listId: string) {
		return this.ListItemModel.find({ listId: listId }).exec();
	}

	async getListItemsByListIdAndUserId(listId: string, userId: string) {
		return this.ListItemModel.find({
			listId: listId,
			userId: userId,
		}).exec();
	}

	async getListItemById(listItemId: string) {
		return this.ListItemModel.findOne({ _id: listItemId }).exec();
	}

	async getListItemByIdAndUserId(listItemId: string, userId: string) {
		return this.ListItemModel.findOne({
			_id: listItemId,
			userId: userId,
		}).exec();
	}

	async addListItem(listItemData: any) {
		const listItemId = shortid.generate();
		const listItem = new this.ListItemModel({
			_id: listItemId,
			...listItemData,
		});
		await listItem.save();
		return listItemId;
	}

	async updateListItemById(listItemId: string, listItemData: any) {
		return this.ListItemModel.findOneAndUpdate(
			{ _id: listItemId, userId: listItemData.userId },
			{ $set: listItemData },
			{ new: true }
		).exec();
	}

	async removeListItemById(listItemId: string) {
		return this.ListItemModel.deleteOne({ _id: listItemId }).exec();
	}
}

export default new ListItemDao();
