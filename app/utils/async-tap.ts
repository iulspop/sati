export const asyncTap = (fn: Function) => async (value: any) => {
  await fn(value)
  return value
}
