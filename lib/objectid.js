// temp counter
// add counting by model
let idCount = 1;

export default class ObjectId {
  constructor() {
    this.val = ObjectId._getLastId();
  }

  valueOf() {
    return this.val;
  }

  toString() {
    return this.val.toString();
  }

  static _getLastId() {
    return idCount++;
  }
}
