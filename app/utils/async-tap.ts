export const asyncTap = (function_: Function) => async (value: any) => {
  await function_(value)
  return value
}
