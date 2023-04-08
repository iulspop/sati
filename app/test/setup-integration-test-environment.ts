import './setup-test-environment'

import { cleanup } from '@testing-library/react'

// Vitest with `--threads` disabled runs all tests in the same global scope.
// Which breaks `@testing-library/react`'s cleanup.
// So we need to run it after each test explicitly.
// See https://github.com/vitest-dev/vitest/issues/1430
afterEach(cleanup)
