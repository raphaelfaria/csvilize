const defaults = {
  String: null,
  Number: null,
  Boolean: false,
  Date: () => new Date,
  Model: null,
};

export default class SchemaType {
  constructor(type) {
    if (typeof type === 'function') {
      this.type = type;
      this.default = typeof defaults[type.name] === 'function' ?
        defaults[type.name]() :
        defaults[type.name];
      this.nullable = true;
    } else {
      const def = type.default || defaults[type.type.name];
      this.type = type.type;
      this.default = typeof def === 'function' ? def() : def;
      this.nullable = typeof type.nullable === 'boolean' ? type.nullable : true;
    }
  }

  verify(value) {
    if (!value) return false;
    if (value === null && this.nullable) return true;
    return this.type === value.constructor;
  }
}
