import { main } from '../src/index';
import * as assert from 'assert';

describe('main', () => {
  it('works', () => {
    assert.equal(main(), 'hi');
  });
});
