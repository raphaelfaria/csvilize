export default class Model {
  constructor(props = {}) {
    if (this.constructor === Model) {
      throw new Error('To create a model, use database.model method');
    }

    this._propsNames = this.schema.getPropertiesNames();
    this._props = {};
    this._buildProps(props);
  }

  _buildProps(props) {
    this._propsNames.forEach(key => {
      let val = props[key];

      if (!props[key]) {
        val = this.schema.getDefault(key);
        // TODO: add an option "nullable" to property definition
      }

      this._addProperty(key);
      this.set(key, val);
    });
  }

  _addProperty(key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get: function get() {
        return this.get(key);
      },
      set: function set(val) {
        return this.set(key, val);
      },
    });
  }

  _verifyProp(prop) {
    if (!prop || typeof prop !== 'string') {
      throw new Error('Invalid property name given');
    }
    if (this._propsNames.indexOf(prop) < 0) {
      throw new Error(`Invalid property: ${prop}`);
    }
  }

  get(prop) {
    this._verifyProp(prop);
    return this._props[prop].valueOf ? this._props[prop].valueOf() : this._props[prop];
  }

  set(prop, value) {
    this._verifyProp(prop);
    if (!value && value !== null) {
      throw new Error('A value should be given');
    }

    if (!this.schema.verifyType(prop, value)) {
      throw new Error(`Property ${prop} should be of type ${this.schema.getTypeName(prop)}`);
    }

    this._props[prop] = value;

    return this._props[prop];
  }

  static compile(name, schema, db) {
    class ModelInstance extends Model {}

    // Add shortcut to db instance
    ModelInstance.db = ModelInstance.prototype.db = db;

    // Add schema to model
    ModelInstance.schema = ModelInstance.prototype.schema = schema;

    // Changes name of Model constructor
    const instanceName = Object.getOwnPropertyDescriptor(ModelInstance, 'name');
    instanceName.value = name;
    Object.defineProperty(ModelInstance, 'name', instanceName);

    return ModelInstance;
  }
}
