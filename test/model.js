import assert from 'assert';
import Model from '../lib/model';
import Schema from '../lib/schema';

describe('Model', () => {
  const carSchema = new Schema({
    year: Number,
  });

  const Car = Model.compile('Car', carSchema);

  it('should compile properly', () => {
    assert.equal(Car.name, 'Car');
    assert.ok(new Car instanceof Model);
  });

  it('should not allow instantiation from Model', () => {
    assert.throws(() => new Model(), Error);
  });

  describe('instance', () => {
    let car;

    beforeEach(() => {
      car = new Car({
        year: 1990,
      });
    });

    it('should be able to get own property', () => {
      assert.equal(car.year, 1990);
      assert.equal(car.get('year'), 1990);
    });

    it('should be able to set own property', () => {
      car.year = 1992;
      assert.equal(car.get('year'), 1992);
    });

    it('should be able to set own property with "set" method', () => {
      car.set('year', 1992);
      assert.equal(car.get('year'), 1992);
    });

    it('should fail to construct because property if of wrong type', () => {
      assert.throws(() => new Car({ year: '1990' }), Error);
    });

    it('should fail to set own property of a different type defined by schema', () => {
      assert.throws(
        () => car.year = '123',
        Error,
        'Property "year" should be of type "Number"'
      );
    });
  });
});
