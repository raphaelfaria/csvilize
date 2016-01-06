import SchemaBlueprint from './schema';
import Model from './model';

export default class Database {
  constructor(path) {
    if (!path) {
      throw new Error('Database requires a path');
    }

    const databaseInstance = this;

    this.Schema = class Schema extends SchemaBlueprint {
      constructor(obj) {
        super(obj);
      }
    };

    this.models = {};

    this.Schema.prototype.db = databaseInstance;
  }

  model(name, schema) {
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid name for model');
    }

    if (this.models[name]) {
      return this.models[name];
    }

    let argSchema = schema;

    if (argSchema.constructor !== this.Schema) {
      argSchema = new this.Schema(argSchema);
    }

    this.models[name] = Model.compile(name, argSchema, this);

    return this.models[name];
  }
}
