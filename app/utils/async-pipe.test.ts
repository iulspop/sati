import { describe, expect, test } from 'vitest'
import { asyncPipe } from './async-pipe'

const double = (n: number) => n * 2
const asyncDouble = (n: number) => Promise.resolve(n * 2)
const asyncInc = (n: number) => Promise.resolve(n + 1)

describe('asyncPipe()', () => {
  test('given two async functions: composes them in reverse mathematical order', async () => {
    const asyncIncDouble = asyncPipe(asyncInc, asyncDouble)

    expect(await asyncIncDouble(20)).toEqual(42)
  })

  test('given one sync and one async function: composes them in reverse mathematical order', async () => {
    const asyncIncDouble = asyncPipe(asyncInc, double)

    expect(await asyncIncDouble(20)).toEqual(42)
  })
})
