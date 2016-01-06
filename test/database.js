import assert from 'assert';
import Database from '../lib/database';
import Schema from '../lib/schema';
import Model from '../lib/model';

describe('Database', () => {
  describe('constructor', () => {
    it('should succeed', () => {
      assert.ok(new Database('data'));
    });

    it('should fail', () => {
      assert.throws(() => new Database(), Error);
    });

    it('should create its own db schema type', () => {
      const db = new Database('data');
      assert.ok(Schema.isPrototypeOf(db.Schema));
    });
  });

  describe('model method', () => {
    let db;

    beforeEach(() => {
      db = new Database('data');
    });

    it('should create and store a model', () => {
      const schema = new db.Schema({ field: String });
      const model = db.model('TheModel', schema);

      assert.ok(model);
      assert.equal(model, db.models.TheModel);
    });

    it('should create a schema if an object is passed', () => {
      const model = db.model('TheModel', { field: String });

      assert.ok(model);
      assert.ok(model.schema);
      assert.ok(model.schema instanceof db.Schema);
    });

    it('should return an already registered model', () => {
      const modelOne = db.model('TheModel', { field: String });
      const modelTwo = db.model('TheModel', { field: String });

      assert.equal(modelOne, modelTwo);
    });

    it('should fail because name is invalid', () => {
      assert.throws(() => {
        db.model('', { field: String });
      }, Error, 'Invalid name for model');

      assert.throws(() => {
        db.model(123, { field: String });
      }, Error, 'Invalid name for model');
    });
  });
});
