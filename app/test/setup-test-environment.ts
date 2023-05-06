import 'dotenv/config'

import { installGlobals } from '@remix-run/node'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'

// Disabled Jest global types since disabled Vitest globals.
// So we need to extend expect types manually.
// source: https://github.com/testing-library/jest-dom/issues/439
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
}

// When global is false, '@testing-library/jest-dom/extend-expect' fails since doesn't have expect.
// So we need to extend expect manually.
// source: https://github.com/vitest-dev/vitest/issues/1504
expect.extend(matchers)

// Need to set cleanup manually since disabled Vitest globals (including afterEach).
// source: https://testing-library.com/docs/react-testing-library/api/#cleanup:~:text=Please%20note%20that%20this%20is%20done%20automatically%20if%20the%20testing%20framework%20you%27re%20using%20supports%20the%20afterEach%20global%20and%20it%20is%20injected%20to%20your%20testing%20environment

// Also vitest with `--threads` disabled runs all tests in the same global scope.
// Which breaks `@testing-library/react`'s cleanup.
// So we need to run it after each test explicitly.
// See https://github.com/vitest-dev/vitest/issues/1430
afterEach(cleanup)

// Required for RemixStub to work?
installGlobals()

// source: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment.
globalThis.IS_REACT_ACT_ENVIRONMENT = true
