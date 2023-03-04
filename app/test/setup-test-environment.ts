import { installGlobals } from '@remix-run/node'
import '@testing-library/jest-dom/extend-expect'
import 'dotenv/config'

installGlobals()

// See https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment.
globalThis.IS_REACT_ACT_ENVIRONMENT = true
