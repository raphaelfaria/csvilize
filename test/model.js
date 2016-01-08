import assert from 'assert';
import Model from '../lib/model';
import Schema from '../lib/schema';

describe('Model', function () {
  const carSchema = new Schema({
    year: Number,
  });

  const Car = Model.compile('Car', carSchema);

  it('should compile properly', function () {
    assert.equal(Car.name, 'Car');
    assert.ok(new Car({ year: 1990 }) instanceof Model);
  });

  it('should not allow instantiation from Model', function () {
    assert.throws(() => new Model(), Error);
  });

  describe('instance', function () {
    let car;

    beforeEach(function () {
      car = new Car({
        year: 1990,
      });
    });

    it('should be able to get own property', function () {
      assert.equal(car.year, 1990);
      assert.equal(car.get('year'), 1990);
    });

    it('should be able to set own property', function () {
      car.year = 1992;
      assert.equal(car.get('year'), 1992);
    });

    it('should be able to set own property with "set" method', function () {
      car.set('year', 1992);
      assert.equal(car.get('year'), 1992);
    });

    it('should convert to string properly', function () {
      const stringRegex =
        /\d\,(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\,){2}\d{4}/;
      const carString = car.toString();
      assert.ok(stringRegex.test(carString));
    });

    it('should get the correct size in bytes', function () {
      assert.equal(car.getSize(), 56);
    });


    // Errors
    it('should fail to get or set inexistant property', function () {
      assert.throws(() => car.get('inexistant'), Error);
      assert.throws(() => car.set('inexistant', 123), Error);
    });

    it('should fail to get or set empty property', function () {
      assert.throws(() => car.get(''), Error);
      assert.throws(() => car.set('', 123), Error);
    });

    it('should fail to set property if value is empty', function () {
      assert.throws(() => car.set('year'), Error);
    });

    it('should fail to construct because property if of wrong type', function () {
      assert.throws(() => new Car({ year: '1990' }), Error);
    });

    it('should fail to set own property of a different type defined by schema', function () {
      assert.throws(
        () => car.year = '123',
        Error,
        'Property "year" should be of type "Number"'
      );
    });
  });
});
