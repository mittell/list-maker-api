export interface IService {
	list: (limit: number, page: number) => Promise<any>;
	getById: (id: string) => Promise<any>;
	create: (listData: any) => Promise<any>;
	putById: (id: string, listData: any) => Promise<string>;
	patchById: (id: string, listData: any) => Promise<string>;
	deleteById: (id: string) => Promise<any>;
}
