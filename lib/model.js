export default class Model {
  static compile(name, schema, db) {
    class ModelInstance extends Model {}

    // Add shortcut to db instance
    ModelInstance.db = ModelInstance.prototype.db = db;

    // Add schema to model
    ModelInstance.schema = ModelInstance.prototype.schema = schema;

    const instanceName = Object.getOwnPropertyDescriptor(ModelInstance, 'name');
    instanceName.value = name;
    Object.defineProperty(ModelInstance, 'name', instanceName);

    return ModelInstance;
  }
}
