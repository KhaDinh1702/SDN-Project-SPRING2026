export const paginate = async (
  model,
  filter = {},
  query = {},
  options = {},
) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  const sort = query.sort || '-createdAt';

  const total = await model.countDocuments(filter);

  let mongooseQuery = model.find(filter).skip(skip).limit(limit).sort(sort);
  
  if (options.select) {
    mongooseQuery = mongooseQuery.select(options.select);
  }

  if (options.populate) {
    mongooseQuery = mongooseQuery.populate(options.populate);
  }

  const data = await mongooseQuery;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    },
  };
};
