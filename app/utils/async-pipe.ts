import { andThen, AtLeastOneFunctionsFlow, pipeWith } from 'ramda'

type AsyncPipe = <TArgs extends any[], TResult>(
  ...fns: AtLeastOneFunctionsFlow<TArgs, TResult>
) => (...args: TArgs) => Promise<TResult>
export const asyncPipe: AsyncPipe =
  (...fns) =>
  async (...x) =>
    await pipeWith(andThen)(fns)(...x)
