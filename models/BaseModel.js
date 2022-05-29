const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Model } = mongoose;
mongoose.plugin(mongoosePaginate);

class BaseModel extends Model {
  static queryBuilder(query, populate = []) {
    const { limit, page, orderBy, filter } = query;
    let { fields } = query;
    if (!fields) {
      fields = this.defaultFields;
    }
    return this.paginate(filter, {
      limit,
      page,
      sort: orderBy,
      select: fields,
      populate,
    });
  }
}

module.exports = BaseModel