import { createRemixStub } from '@remix-run/testing/dist/create-remix-stub'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import type { RecurringQuestion } from '~/self-data-collection/domain/entities/recurring-question'
import type { DeleteQuestionFormEntries } from './edit-question-form-component'
import { EditQuestionFormComponent } from './edit-question-form-component'

describe('EditQuestionFormComponent()', () => {
  test('given a recurring question: render question text', async () => {
    const recurringQuestion: RecurringQuestion = {
      userId: '1',
      id: '1',
      order: 1,
      text: 'Did you go to bed between 8 and 9PM?',
      phase: {
        timestamp: new Date(),
        utcOffsetInMinutes: -300,
      },
    }

    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <EditQuestionFormComponent {...recurringQuestion} />,
      },
    ])

    render(<RemixStub />)

    expect(screen.getByText(recurringQuestion.text)).toBeInTheDocument()
  })

  test('given a recurring question: render a "Cancel" link to /questions', async () => {
    const recurringQuestion: RecurringQuestion = {
      userId: '1',
      id: '1',
      order: 1,
      text: 'Did you go to bed between 8 and 9PM?',
      phase: {
        timestamp: new Date(),
        utcOffsetInMinutes: -300,
      },
    }

    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <EditQuestionFormComponent {...recurringQuestion} />,
      },
    ])

    render(<RemixStub />)

    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', '/questions')
  })

  test('given a recurring question and a delete submit: send a delete request with questionId', async () => {
    const recurringQuestion: RecurringQuestion = {
      userId: '1',
      id: '1',
      order: 1,
      text: 'Did you go to bed between 8 and 9PM?',
      phase: {
        timestamp: new Date(),
        utcOffsetInMinutes: -300,
      },
    }

    let formData: FormData | undefined
    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <EditQuestionFormComponent {...recurringQuestion} />,
        action: async ({ request }) => {
          formData = await request.formData()
          return null
        },
      },
    ])

    const user = userEvent.setup()
    render(<RemixStub />)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    // @ts-expect-error
    const deleteQuestionFormEntries: DeleteQuestionFormEntries = Object.fromEntries(formData.entries())
    expect(deleteQuestionFormEntries).toEqual({ questionId: '1' })
  })
})
