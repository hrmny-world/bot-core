// @ts-nocheck
import * as TextHelpers from './text-helpers';

describe('Text Helpers', () => {
  describe('formatStringDict', () => {
    const format = TextHelpers.formatStringDict;
    test('should be defined', () => {
      expect(TextHelpers.formatStringDict).toBeTruthy();
      expect(typeof TextHelpers.formatStringDict).toEqual('function');
    });
    test('should make substitutions with 1 argument', () => {
      expect(format('Hello {name}.', { name: 'Kaffe' })).toEqual('Hello Kaffe.');
      expect(format('{name}', { name: 'Kaffe' })).toEqual('Kaffe');
      expect(format('Hello {name}', { name: 'Kaffe' })).toEqual('Hello Kaffe');
      expect(format('{name}, Hello', { name: 'Kaffe' })).toEqual('Kaffe, Hello');
    });
    test('should make substitutions with multiple arguments', () => {
      expect(
        format('Did you know that {name} likes {hobby}?', { name: 'Kaffe', hobby: 'programming' }),
      ).toEqual('Did you know that Kaffe likes programming?');
      expect(format('{name} likes {hobby}', { name: 'Kaffe', hobby: 'programming' })).toEqual(
        'Kaffe likes programming',
      );
      expect(format('{name}{hobby}', { name: 'Kaffe', hobby: 'programming' })).toEqual(
        'Kaffeprogramming',
      );
    });
    test('should not break with invalid arguments', () => {
      expect(format()).toEqual('');
      expect(format('')).toEqual('');
      expect(format('Hello')).toEqual('Hello');
      expect(format('Hello {name}')).toEqual('Hello {name}');
      expect(format({})).toEqual('');
      expect(format([])).toEqual('');
      expect(format(0)).toEqual('');
      expect(format(1)).toEqual('');
      expect(format(null)).toEqual('');
      expect(format('Hello {name}', {})).toEqual('Hello {name}');
      expect(format('Hello {name}', { hobby: 'programming' })).toEqual('Hello {name}');
      expect(format('Hello {prototype}', { hobby: 'programming' })).toEqual('Hello {prototype}');
    });
  });

  describe('numbers', () => {
    const numbers = TextHelpers.numbers;
    test('should return an empty array for invalid inputs', () => {
      expect(numbers(' ')).toEqual([]);
      expect(numbers('')).toEqual([]);
      expect(numbers('.')).toEqual([]);
      expect(numbers()).toEqual([]);
      expect(numbers(null)).toEqual([]);
      expect(numbers({})).toEqual([]);
      expect(numbers('Infinity')).toEqual([]);
      expect(numbers(Infinity)).toEqual([]);
      expect(numbers('NaN')).toEqual([]);
      expect(numbers(NaN)).toEqual([]);
      expect(numbers(123)).toEqual([]);
    });

    test('should extract numbers from string', () => {
      expect(numbers('0')).toEqual([0]);
      expect(numbers('0.0')).toEqual([0.0]);
      expect(numbers('.0')).toEqual([0.0]);
      expect(numbers('0.000001')).toEqual([0.000001]);
      expect(numbers('123')).toEqual([123]);
      expect(numbers('123,4')).toEqual([123, 4]);
      expect(numbers('123 4')).toEqual([123, 4]);
      expect(numbers('123.4')).toEqual([123.4]);
      expect(numbers('123.')).toEqual([123]);
      expect(numbers('.4')).toEqual([0.4]);
      expect(numbers('1......4')).toEqual([1, 4]);
      expect(numbers('1,,,,,,,,,4')).toEqual([1, 4]);
      expect(numbers('123!!!!!7897 >>>>>28')).toEqual([123, 7897, 28]);
      expect(numbers('[123,12,22]: 28 (14) **99** (0 )0 1_2')).toEqual([
        123, 12, 22, 28, 14, 99, 0, 0, 1, 2,
      ]);
      expect(numbers('!randomnumber min 25 max 88')).toEqual([25, 88]);
      expect(numbers('!randomnumber min -100 max 100')).toEqual([-100, 100]);
      expect(numbers('0[object Object]-4[object Object]')).toEqual([0, -4]);
    });

    test('should handle plus and minus signs', () => {
      expect(numbers('+123')).toEqual([123]);
      expect(numbers('-123')).toEqual([-123]);
      expect(numbers('+-123')).toEqual([-123]);
      expect(numbers('-+123')).toEqual([-123]);
      expect(numbers('+123+123')).toEqual([123, 123]);
      expect(numbers('-+++++++123')).toEqual([-123]);
      expect(numbers('+--------123')).toEqual([-123]);
      expect(numbers('+++123')).toEqual([123]);
      expect(numbers('-- 123 123 -+123 -123 +123 - - - 123')).toEqual([
        123, 123, -123, -123, 123, 123,
      ]);
    });
  });

  describe('lines', () => {
    const lines = TextHelpers.lines;

    test('should break arguments into lines', () => {
      expect(lines('hello')).toEqual('hello');
      expect(lines('hello', 'Kaffe')).toEqual('hello\nKaffe');
      expect(lines('  hello', '    Kaffe    ')).toEqual('hello\nKaffe');
      expect(lines('hello', {})).toEqual('hello\n[object Object]');
      expect(lines('hello', { toString: () => 'fancy' })).toEqual('hello\nfancy');
      expect(lines('hello', 1, '   Kaffe    ')).toEqual('hello\n1\nKaffe');
    });
    test('should not break with invalid arguments', () => {
      expect(lines()).toEqual('');
      expect(lines(1, 2, 3)).toEqual('1\n2\n3');
      expect(lines(null)).toEqual('');
    });
  });
});
