import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import type { CreateQuestionFormEntries } from './create-question-form-component'
import { CreateQuestionFormComponent } from './create-question-form-component'

describe('CreateQuestionForm component', () => {
  test('given a new recurring question submitted: form data contains only question text', async () => {
    vi.useFakeTimers()

    // Workaround for testing library not supporting Vitest fake timers by default
    // https://github.com/testing-library/react-testing-library/issues/1197
    globalThis.jest = {
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    }

    globalThis.IS_REACT_ACT_ENVIRONMENT = true

    const fixedDate = new Date('2022-10-20T01:00:00.000Z')
    vi.setSystemTime(fixedDate)

    let formData: FormData | undefined
    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <CreateQuestionFormComponent />,
        action: async ({ request }) => {
          formData = await request.formData()
          return null
        },
      },
    ])

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    })
    render(<RemixStub />)

    const questionText = 'Did you go to bed between 8 and 9PM?'

    await user.type(screen.getByLabelText('What recurring question to add?'), questionText)

    // Necessary redundant act because fake timer workaround somehow causes this warning:
    // "Warning: An update to RouterProvider inside a test was not wrapped in act(...)."
    // RouterProvider is used by the RemixStub.
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /submit/i }))
    })

    // @ts-expect-error
    const formEntries: CreateQuestionFormEntries = Object.fromEntries(formData.entries())
    expect(formEntries).toEqual({
      text: questionText,
      timestamp: fixedDate.toISOString(),
      utcOffsetInMinutes: String(fixedDate.getTimezoneOffset()),
    })

    vi.useRealTimers()
  })

  test('given form render: has cancel link to back to /questions', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <CreateQuestionFormComponent />,
      },
    ])
    render(<RemixStub />)

    expect(screen.getByRole('link', { name: /cancel/i })).toHaveAttribute('href', '/questions')
  })

  test('given click submit before input text: does not submit form', async () => {
    let formData: FormData | undefined
    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <CreateQuestionFormComponent />,
        action: async ({ request }) => {
          formData = await request.formData()
          return null
        },
      },
    ])

    const user = userEvent.setup()
    render(<RemixStub />)

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(formData).toEqual(undefined)
  })
})
