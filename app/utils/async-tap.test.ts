import { describe, test } from 'vitest'
import { asyncPipe } from './async-pipe'
import { asyncTap } from './async-tap'

const delay = (milliseconds: number) => (fn: Function) => (value: any) =>
  new Promise(resolve => setTimeout(() => resolve(fn(value)), milliseconds))

const createState = (n = 0) => ({
  update: (v: number) => (n = v),
  read: () => n,
})

describe('asyncTap()', () => {
  test('given an async effect: awaits it', async () => {
    const { update, read } = createState()
    const updateEffect = asyncTap(delay(10)(update))
    const chain = asyncPipe(updateEffect, read)

    expect(await chain(1)).toEqual(1)
  })
})
