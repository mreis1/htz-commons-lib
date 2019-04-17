import { noop } from './noop';

test('noop', () => expect(typeof noop).toBe('function'));
