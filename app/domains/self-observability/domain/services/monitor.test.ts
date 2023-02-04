import { test } from 'vitest'
import { eventFactory } from '../entities/event'
import { budget, currentPercentage, interpret, maxPossiblePercentage, remainingBudget, spentBudget } from './monitor'

describe('interpret()', () => {
  test('given Events: returns interpreted Results', () => {
    // prettier-ignore
    const events = [
      { data: { response: true } },
      { data: { response: false } },
      { data: { response: true } },
    ].map(event => eventFactory(event))

    const results = interpret(events)

    expect(results).toEqual([true, false, true])
  })
})

describe('maxPossiblePercentage()', () => {
  test('given denominator and results: returns max possible percentage if all further results are positive', () => {
    expect(maxPossiblePercentage(5)([true])).toEqual(1)
    expect(maxPossiblePercentage(5)([false])).toEqual(0.8)
    expect(maxPossiblePercentage(10)([false, false, true, false])).toEqual(0.7)
  })
})

describe('currentPercentage()', () => {
  test('given denominator and results: returns percentage of positive results out of total', () => {
    expect(currentPercentage(5)([true])).toEqual(0.2)
    expect(currentPercentage(5)([false])).toEqual(0)
    expect(currentPercentage(10)([false, false, true, false])).toEqual(0.1)
  })
})

describe('budget()', () => {
  test('given denominator and target positive results percentage: returns negative result budget', () => {
    expect(budget(5)(0.2)).toEqual(4)
    expect(budget(5)(0.5)).toEqual(2)
    expect(budget(10)(1)).toEqual(0)
  })
})

describe('spentBudget()', () => {
  test('given results: counts negative results', () => {
    expect(spentBudget([true])).toEqual(0)
    expect(spentBudget([false])).toEqual(1)
    expect(spentBudget([false, false, true, false])).toEqual(3)
  })
})

describe('remainingBudget()', () => {
  test('given budget and spent budget: returns remaining negative result budget', () => {
    expect(remainingBudget(5)(1)).toEqual(4)
    expect(remainingBudget(5)(5)).toEqual(0)
  })
})
