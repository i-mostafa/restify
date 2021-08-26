const maxRecordsPerQuery = process.env.MAX_RECORD_PER_QUERY || 20;
const defaultRecordPerQuery = process.env.DEFAULT_RECORD_PER_QUERY || 10;
const defaultSortQuery = process.env.DEFAULT_SORT_QUERY || "-createdAt";
const filterStaticFields = [
  "page",
  "limit",
  "skip",
  "sort",
  "fields",
  "popFields",
  "exclude",
];

const translateSortQuer = (sortQuery = "") => {
  if (!sortQuery) return undefined;

  let result = {};
  sortQuery?.split(",").forEach((field) => {
    if (field.startsWith("-")) {
      const sortField = field.substring(1);
      result[sortField] = "desc";
      return;
    }
    result[field] = "asc";
  });
  return result;
};

const resolveNestedPath = (path = "", value = true) => {
  console.log(path, value);
  if (!path) return undefined;
  const pathParts = path.split(".");
  const result = {};
  let current = result;
  pathParts.forEach((part, i) => {
    if (pathParts[i + 1]) {
      current[part] = { [pathParts[i + 1]]: value };
      current = current[part];
      return;
    }
    current[part] = value;
  });
  return result;
};

const translatePaths = (paths = "") => {
  if (!paths) return undefined;
  let result = {};
  paths
    .split(",")
    .forEach(
      (path) => (result = { ...result, ...resolveNestedPath(path, true) })
    );
  return result;
};

const removeFilterStaticFields = (queryObj) =>
  filterStaticFields.forEach((field) => delete queryObj[field]);

const resolveFilterQuery = (query) => {
  removeFilterStaticFields(query);
  let filter = {};
  Object.keys(query || {}).forEach(
    (path) => (filter = { ...filter, ...resolveNestedPath(path, query[path]) })
  );
  return filter;
};

const validateExField = (exFiled, item) => {
  switch (exFiled) {
    case "id":
      return Number(item);
    default:
      return item;
  }
};

const resolveExCludeQuery = (qExclude, exFiled = "id") => {
  const excludeItems = qExclude && qExclude.split(",");

  if (excludeItems && excludeItems.length) {
    const validatedExItems = excludeItems.map((item) =>
      validateExField(exFiled, item)
    );
    const exclude = {
      NOT: {
        [exFiled]: {
          in: validatedExItems,
        },
      },
    };
    return exclude;
  }
  return undefined;
};
module.exports = class {
  constructor(queryObj = {}) {
    console.log(queryObj);
    this.queryObj = queryObj;
    this.query = {};
  }

  /**
   * add pagination with skip and limit paramaters
   */

  paginate({ unlimited = false } = {}) {
    const { page: qPage, limit: qLimit, skip: qskip } = this.queryObj;

    const page = qPage * 1 || 1;
    let limit = unlimited ? undefined : defaultRecordPerQuery;
    if (qLimit)
      limit = qLimit * 1 > maxRecordsPerQuery ? maxRecordsPerQuery : qLimit * 1;
    const skip = qskip
      ? qskip * 1
      : (page - 1) * (limit || defaultRecordPerQuery);

    this.query.skip = skip;
    this.query.take = limit;
    return this;
  }

  filter() {
    const filter = resolveFilterQuery({ ...this.queryObj });
    this.query.where = filter;
    return this;
  }

  sort() {
    const { sort: qSort } = this.queryObj;
    let sort = translateSortQuer(qSort || defaultSortQuery);
    this.query.orderBy = sort;
    return this;
  }

  exclude({ exFiled } = {}) {
    const { exclude: qExclude } = this.queryObj;
    const exclude = resolveExCludeQuery(qExclude, exFiled);
    if (exclude) {
      if (!this.query.where) this.query.where = {};
      this.query.where = { ...this.query.where, ...exclude };
    }
    return this;
  }

  limitfilds() {
    const { fields: qFields } = this.queryObj;
    const fields = translatePaths(qFields);
    this.query.select = fields;
    return this;
  }

  populate() {
    const { popFields: qPopFields } = this.queryObj;
    const popFields = translatePaths(qPopFields);
    this.query.include = popFields;
    return this;
  }

  exec({ exFiled = "id", unlimited = false } = {}) {
    return this.filter()
      .exclude({ exFiled })
      .paginate({ unlimited })
      .sort()
      .limitfilds()
      .populate().query;
  }
};
