import assert from 'assert';
import Schema from '../lib/schema';
import Model from '../lib/model';

describe('Schema', () => {
  describe('constructor', () => {
    function newSchema(obj) {
      return new Schema(obj);
    }

    it('should succeed', () => {
      const schema = {
        str: String,
        num: Number,
        bool: Boolean,
        date: Date,
        model: Model.compile('Test'),
        detailed: {
          type: String,
          default: 'blabla',
        },
      };

      assert.ok(newSchema(schema));
    });

    it('should fail', () => {
      const schema = {
        str: String,
        err: Error,
      };

      assert.throws(() => newSchema(schema), Error);
    });
  });

  describe('methods', () => {
    let schema;

    beforeEach(() => {
      schema = new Schema({
        str: String,
        num: {
          type: Number,
          default: 123,
        },
      });
    });

    it('should get the default value for a property', () => {
      assert.equal(schema.getDefault('str'), null);
      assert.equal(schema.getDefault('num'), 123);
    });

    it('should get type of property', () => {
      assert.equal(schema.getType('str'), String);
      assert.equal(schema.getType('num'), Number);
    });

    it('should get type name of property', () => {
      assert.equal(schema.getTypeName('str'), 'String');
      assert.equal(schema.getTypeName('num'), 'Number');
    });
  });
});
