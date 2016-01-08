import assert from 'assert';
import ObjectId from '../lib/objectid';

describe('ObjectId', function () {
  describe('constructor', function () {
    it('should succeed', function () {
      assert.ok(new ObjectId);
    });

    it('should give the correct ids', function () {
      const id1 = new ObjectId;
      const id2 = new ObjectId;

      assert.equal(id1 + 0, id2 - 1);
    });
  });
});
