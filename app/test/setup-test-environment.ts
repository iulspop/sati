import '@testing-library/jest-dom/vitest'
import 'dotenv/config'

import { installGlobals } from '@remix-run/node'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Need to set cleanup manually since Vitest disables globals by default (including afterEach).
// source: https://testing-library.com/docs/react-testing-library/api/#cleanup:~:text=Please%20note%20that%20this%20is%20done%20automatically%20if%20the%20testing%20framework%20you%27re%20using%20supports%20the%20afterEach%20global%20and%20it%20is%20injected%20to%20your%20testing%20environment
afterEach(cleanup)

// This installs globals such as "fetch", "Response", "Request" and "Headers" for RemixStub to work in unit tests.
// https://remix.run/docs/en/main/other-api/node
installGlobals()

// source: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment.
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// removes "Warning: The current testing environment is not configured to support act" caused by
// necessary redundant act in `create-question-form-component.test.tsx`:
// ```
//  await act(async () => {
//    await user.click(screen.getByRole('button', { name: /submit/i }))
//  })
// ```
// Monkey path solution found here: https://stackoverflow.com/a/74228751
const originalConsoleError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].startsWith('Warning: The current testing environment is not configured to support act')
  ) {
    return
  }
  originalConsoleError.apply(console, args)
}
