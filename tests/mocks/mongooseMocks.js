function createMockModel(defaultDoc = null, methodOverrides = {}) {
	const val = (method, fallback) =>
		Object.prototype.hasOwnProperty.call(methodOverrides, method) ? methodOverrides[method] : fallback;

	return {
		findOne: jest.fn().mockResolvedValue(val("findOne", defaultDoc)),
		findById: jest.fn().mockResolvedValue(val("findById", defaultDoc)),
		find: jest.fn().mockResolvedValue(val("find", defaultDoc ? [defaultDoc] : [])),
		create: jest.fn().mockResolvedValue(val("create", defaultDoc)),
		insertMany: jest.fn().mockResolvedValue(val("insertMany", defaultDoc ? [defaultDoc] : [])),
		findOneAndUpdate: jest.fn().mockResolvedValue(val("findOneAndUpdate", defaultDoc)),
		findOneAndDelete: jest.fn().mockResolvedValue(val("findOneAndDelete", defaultDoc)),
		findOneAndReplace: jest.fn().mockResolvedValue(val("findOneAndReplace", defaultDoc)),
		findByIdAndUpdate: jest.fn().mockResolvedValue(val("findByIdAndUpdate", defaultDoc)),
		findByIdAndDelete: jest.fn().mockResolvedValue(val("findByIdAndDelete", defaultDoc)),
		updateOne: jest.fn().mockResolvedValue(val("updateOne", { acknowledged: true, modifiedCount: 1 })),
		updateMany: jest.fn().mockResolvedValue(val("updateMany", { acknowledged: true, modifiedCount: 1 })),
		deleteOne: jest.fn().mockResolvedValue(val("deleteOne", { acknowledged: true, deletedCount: 1 })),
		deleteMany: jest.fn().mockResolvedValue(val("deleteMany", { acknowledged: true, deletedCount: 1 })),
		replaceOne: jest.fn().mockResolvedValue(val("replaceOne", { acknowledged: true, modifiedCount: 1 })),
		countDocuments: jest.fn().mockResolvedValue(val("countDocuments", 0)),
		estimatedDocumentCount: jest.fn().mockResolvedValue(val("estimatedDocumentCount", 0)),
		aggregate: jest.fn().mockResolvedValue(val("aggregate", [])),
		distinct: jest.fn().mockResolvedValue(val("distinct", [])),
		save: jest.fn().mockResolvedValue(val("save", defaultDoc)),

		modelName: "MockModel",
	};
}

module.exports = { createMockModel };
