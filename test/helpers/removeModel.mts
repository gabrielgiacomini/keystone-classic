import mongoose from 'mongoose';
import keystone from 'keystone';

export default function removeModel(modelName: string) {
	const registeredList = keystone.lists[modelName];
	if (registeredList) {
		Reflect.deleteProperty(keystone.lists, modelName);
		if (registeredList.path) {
			Reflect.deleteProperty(keystone.paths, registeredList.path);
		}
	}
	Object.entries(keystone.paths).forEach(function ([path, key]) {
		if (key === modelName) {
			Reflect.deleteProperty(keystone.paths, path);
		}
	});
	Reflect.deleteProperty(mongoose.models, modelName);
	const conn = mongoose.connection;
	if (modelName in conn.models) {
		Reflect.deleteProperty(conn.models, modelName);
	}
}
