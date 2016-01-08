import assert from 'assert';
import Schema from '../lib/schema';
import Model from '../lib/model';

describe('Schema', function () {
  describe('constructor', function () {
    function newSchema(obj) {
      return new Schema(obj);
    }

    it('should succeed', function () {
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

    it('should fail', function () {
      const schema = {
        str: String,
        err: Error,
      };

      assert.throws(() => newSchema(schema), Error);
    });
  });

  describe('methods', function () {
    let schema;

    beforeEach(() => {
      schema = new Schema({
        str: String,
        num: Number,
        bool: Boolean,
        date: Date,
        model: Model.compile('Test'),
        detailed: {
          type: String,
          default: 'blabla',
        },
      });
    });

    it('should get the default value for a property', function () {
      assert.equal(schema.getDefault('str'), null);
      assert.equal(schema.getDefault('num'), null);
      assert.equal(schema.getDefault('bool'), false);

      const date = Math.floor(Date.now() / 1000);
      const defaultDate = Math.floor(schema.getDefault('date') / 1000);

      assert.equal(date, defaultDate);

      assert.equal(schema.getDefault('detailed'), 'blabla');
    });

    it('should get type of property', function () {
      assert.equal(schema.getType('str'), String);
      assert.equal(schema.getType('num'), Number);
    });

    it('should get type name of property', function () {
      assert.equal(schema.getTypeName('str'), 'String');
      assert.equal(schema.getTypeName('num'), 'Number');
    });
  });
});
