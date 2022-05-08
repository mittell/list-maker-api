import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import shortid from 'shortid';

@modelOptions({
	schemaOptions: {
		_id: true,
		timestamps: true,
		toObject: { virtuals: true },
	},
})
class List {
	@prop()
	public _id!: string;

	@prop({ type: () => String, required: true })
	public title!: string;

	@prop({ type: () => String, required: true })
	public description!: string;

	@prop({ type: () => String, required: true })
	public userId!: string;
}

class ListDao {
	ListModel = getModelForClass(List);

	constructor() {}

	async getLists(limit: number, page: number) {
		return this.ListModel.find()
			.limit(limit)
			.skip(limit * page)
			.exec();
	}

	async getListById(listId: string) {
		return this.ListModel.findOne({ _id: listId }).exec();
	}

	async addList(listData: any) {
		const listId = shortid.generate();
		const list = new this.ListModel({
			_id: listId,
			...listData,
		});
		await list.save();
		return listId;
	}

	async updateListById(listId: string, listData: any) {
		return this.ListModel.findOneAndUpdate(
			{ _id: listId },
			{ $set: listData },
			{ new: true }
		).exec();
	}

	async removeListById(listId: string) {
		return this.ListModel.deleteOne({ _id: listId }).exec();
	}
}

export default new ListDao();
