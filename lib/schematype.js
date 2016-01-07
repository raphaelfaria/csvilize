const defaults = {
  String: null,
  Number: null,
  Boolean: false,
  Date: Date.now,
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
      this.type = type.type;
      this.default = type.default || defaults[type.type.name];
      this.nullable = typeof type.nullable === 'boolean' ? type.nullable : true;
    }
  }
}