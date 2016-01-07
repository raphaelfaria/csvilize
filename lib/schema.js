import Model from './model';
import SchemaType from './schematype';
import ObjectId from './objectid';
import assign from 'lodash.assign';
import cloneDeep from 'lodash.clonedeep';

const allowedTypes = [
  ObjectId,
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

    Object.defineProperty(this, '_protectedFields', {
      value: ['id', 'dateCreated', 'dateUpdated'],
      writable: false,
    });

    this.schemaObj = Schema._buildObj(obj);
    this.schemaKeys = Object.keys(this.schemaObj);
    this.schemaTypes = Schema._buildTypes(this.schemaObj);
  }

  verifyType(prop, value) {
    return this.schemaTypes[prop].verify(value);
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
    const mainPropsObj = {
      id: {
        type: ObjectId,
        default: () => new ObjectId,
        nullable: false,
      },
      dateCreated: {
        type: Date,
        nullable: false,
      },
      dateUpdated: {
        type: Date,
        nullable: false,
      },
    };

    const obj = cloneDeep(object);

    return assign(mainPropsObj, obj);
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
