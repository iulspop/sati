import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { CreateQuestionFormComponent } from './create-question-form-component'

describe('CreateQuestionForm component', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    // Workaround for testing library not supporting Vitest fake timers by default
    // https://github.com/testing-library/react-testing-library/issues/1197
    globalThis.jest = {
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    }
  })

  beforeAll(() => {
    vi.useRealTimers()
  })

  test('given a new recurring question submitted: form data contains only question text', async () => {
    const date = new Date('2022-10-20T01:00:00.000Z')
    vi.setSystemTime(date)

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
    await user.type(screen.getByLabelText('What is the recurring question?'), questionText)
    await user.click(screen.getByRole('button', { name: /submit/i }))

    const formEntries = Object.fromEntries(formData.entries())
    expect(formEntries).toEqual({
      text: questionText,
      timestamp: date.toISOString(),
      utcOffsetInMinutes: String(date.getTimezoneOffset()),
    })
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

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    })
    render(<RemixStub />)

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(formData).toEqual(undefined)
  })
})
