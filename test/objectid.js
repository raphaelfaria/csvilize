import assert from 'assert';
import ObjectId from '../lib/objectid';

describe('ObjectId', () => {
  describe('constructor', () => {
    it('should succeed', () => {
      assert.ok(new ObjectId);
    });

    it('should give the correct ids', () => {
      const id1 = new ObjectId;
      const id2 = new ObjectId;

      assert.equal(id1 + 0, id2 - 1);
    });
  });
});
