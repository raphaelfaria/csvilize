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
});
