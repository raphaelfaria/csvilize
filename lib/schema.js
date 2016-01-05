import Model from './model';

const allowedTypes = [
  String,
  Number,
  Boolean,
  Date,
  Model,
];

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export default class Schema {
  constructor(obj) {
    const isValid = Schema._verifySchemaObject(obj);
    if (isValid !== true) {
      throw new Error(
        `Fields "${isValid.toString().replace(/\,/g, ', ')}" have types that are not allowed`
      );
    }

    this.schemaObj = obj;
    this.schemaTypes = Schema._buildTypes(obj);
  }

  // compile(props, ctx) {
  //   Object.keys(props).forEach(key => {

  //   });
  // }

  verifyType(prop, value) {
    const schemaType = this.schemaTypes[prop];
    if (value === null && schemaType.nullable) return true;
    return schemaType.type === value.constructor;
  }

  getDefault(prop) {
    return this.schemaTypes[prop].default;
  }

  getType(prop) {
    return this.schemaTypes[prop].type;
  }

  getTypeName(prop) {
    return this.getType(prop).name;
  }

  getPropertiesNames() {
    return Object.keys(this.schemaObj);
  }

  static _buildTypes(object) {
    // Type example:
    // {
    //   type: String,
    //   default: 'some default string',
    //   nullable: true,
    // }

    // TODO: Replace with class constructor SchemaType
    const type = {
      type: String,
      default: null,
      nullable: true,
    };

    const types = {};

    Object.keys(object).forEach(key => {
      const obj = object[key];
      const tempType = Object.create(type);
      types[key] = tempType;

      if (!isObject(obj)) {
        tempType.type = obj;
        return false;
      }

      tempType.type = obj.type;

      if (obj.default) tempType.default = obj.default;
      if (obj.nullable) tempType.nullable = obj.nullable;
    });

    return types;
  }

  static _verifySchemaAttributeObj(object) {
    return allowedTypes.indexOf(object.type) >= 0 || Model.isPrototypeOf(object.type);
  }

  static _verifySchemaObject(object) {
    const invalidFields = [];

    Object.keys(object).reduce((validity, key) => {
      const obj = object[key];

      if (allowedTypes.indexOf(obj) >= 0) {
        return validity;
      }

      if (Model.isPrototypeOf(obj)) {
        return validity;
      }

      if (isObject(obj) && Schema._verifySchemaAttributeObj(obj)) {
        return validity;
      }

      invalidFields.push(key);

      return false;
    }, true);

    return invalidFields.length ? invalidFields : true;
  }
}
