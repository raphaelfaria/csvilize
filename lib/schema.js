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

  }

  static _verifySchemaAttributeObj(object) {
    return object in allowedTypes || Model.isPrototypeOf(object);
  }

  static _verifySchemaObject(object) {
    const invalidFields = [];

    Object.keys(object).forEach(key => {
      const obj = object[key];

      if (isObject(obj) &&
          !Schema._verifySchemaAttributeObj(obj) ||
          !(obj in allowedTypes) ||
          !Model.isPrototypeOf(obj)) {
        invalidFields.push(key);
      }
    });

    return invalidFields.length ? invalidFields : true;
  }
}
