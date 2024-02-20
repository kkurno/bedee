import type { InputData, OutputData } from './index';
import run from '.';

describe('Test cases', () => {
  test('Case 1', () => {
    const input: InputData = ['flower', 'flow', 'flight'];
    const expectedOutput: OutputData = 'fl';
    const func = jest.fn(run);
    expect(func(input)).toBe(expectedOutput);
  });
  test('Case 2', () => {
    const input: InputData = ['dog', 'racecar', 'car'];
    const expectedOutput: OutputData = '';
    const func = jest.fn(run);
    expect(func(input)).toBe(expectedOutput);
  });
  test('Case 3', () => {
    const input: InputData = ['abcdef', 'aaaaaa', 'aabbc'];
    const expectedOutput: OutputData = 'a';
    const func = jest.fn(run);
    expect(func(input)).toBe(expectedOutput);
  });
  test('Case 4', () => {
    const input: InputData = ['', '', ''];
    const expectedOutput: OutputData = '';
    const func = jest.fn(run);
    expect(func(input)).toBe(expectedOutput);
  });
  test('Case 5', () => {
    const input: InputData = ['', 'flow', 'longlonglonglonglong'];
    const expectedOutput: OutputData = '';
    const func = jest.fn(run);
    expect(func(input)).toBe(expectedOutput);
  });
  test('Case 6', () => {
    const input: InputData = ['digital', 'dig', 'dimension'];
    const expectedOutput: OutputData = 'di';
    const func = jest.fn(run);
    expect(func(input)).toBe(expectedOutput);
  });
});
