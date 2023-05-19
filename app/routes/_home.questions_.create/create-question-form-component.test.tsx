import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { CreateQuestionFormComponent } from './create-question-form-component'

type CreateQuestionFormEntries = {
  text: string
}

describe('CreateQuestionForm component', () => {
  test('given a new recurring question submitted: form data contains only question text', async () => {
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

    const questionText = 'Did you go to bed between 8 and 9PM?'
    await user.type(screen.getByLabelText('What is the recurring question?'), questionText)
    await user.click(screen.getByRole('button', { name: /submit/i }))

    // @ts-expect-error
    const formEntries: CreateQuestionFormEntries = Object.fromEntries(formData.entries())
    expect(formEntries).toEqual({ text: questionText })
  })
})
