import Model from './model';
import SchemaType from './schematype';
import _ from 'lodash';

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

    this.schemaObj = Schema._buildObj(obj);
    this.schemaKeys = Object.keys(this.schemaObj);
    this.schemaTypes = Schema._buildTypes(this.schemaObj);
  }

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
    return this.schemaKeys;
  }

  static _buildObj(object) {
    // id: Number,
    // dateCreated: Date,
    // dateUpdated: Date,

    return _.cloneDeep(object);
  }

  static _buildTypes(object) {
    const types = {};

    Object.keys(object).forEach(key => {
      const obj = object[key];
      types[key] = new SchemaType(obj);
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
