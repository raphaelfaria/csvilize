import assert from 'assert';
import Model from '../lib/model';

describe('Model', function () {
  it('should compile properly', () => {
    const Car = Model.compile('Car');

    assert.equal(Car.name, 'Car');
    assert.ok(new Car instanceof Model);
  });
});
