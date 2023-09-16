import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import type { Prompt } from '~/self-data-collection/domain/value-objects/prompt'

import type { PromptCardComponentFormEntries } from './prompt-card-component'
import { PromptCardComponent } from './prompt-card-component'

describe('PromptCardComponent()', () => {
  test('given prompt data: renders form with yes and no answer buttons', async () => {
    const prompt: Prompt = {
      questionId: '1',
      question: 'What is your name?',
      timestamp: new Date('2021-01-01T00:00:00.000Z'),
    }

    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <PromptCardComponent {...prompt} />,
      },
    ])

    render(<RemixStub />)

    const yesButton = screen.getByLabelText(`Answer "${prompt.question}" with Yes`)
    expect(yesButton).toHaveTextContent('Yes')

    const noButton = screen.getByLabelText(`Answer "${prompt.question}" with No`)
    expect(noButton).toHaveTextContent('No')
  })

  test('given submitting a yes answer: form data contains only "Yes" answer, questionId and timestamp', async () => {
    const prompt: Prompt = {
      questionId: '1',
      question: 'What is your name?',
      timestamp: new Date('2021-01-01T00:00:00.000Z'),
    }

    let formData: FormData | undefined
    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <PromptCardComponent {...prompt} />,
        action: async ({ request }) => {
          formData = await request.formData()
          return null
        },
      },
    ])

    const user = userEvent.setup()
    render(<RemixStub />)

    const yesButton = screen.getByLabelText(`Answer "${prompt.question}" with Yes`)
    await user.click(yesButton)

    // @ts-expect-error
    const answer: PromptCardComponentFormEntries = Object.fromEntries(formData.entries())

    expect(answer).toEqual({
      questionId: '1',
      timestamp: '2021-01-01T00:00:00.000Z',
      response: 'Yes',
    })
  })

  test('given submitting a no answer: form data only contains "No" answer, questionId and timestamp', async () => {
    const prompt: Prompt = {
      questionId: '1',
      question: 'What is your name?',
      timestamp: new Date('2021-01-01T00:00:00.000Z'),
    }

    let formData: FormData | undefined
    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <PromptCardComponent {...prompt} />,
        action: async ({ request }) => {
          formData = await request.formData()
          return null
        },
      },
    ])

    const user = userEvent.setup()
    render(<RemixStub />)

    const noButton = screen.getByLabelText(`Answer "${prompt.question}" with No`)
    await user.click(noButton)

    // @ts-expect-error
    const answer: PromptCardComponentFormEntries = Object.fromEntries(formData.entries())

    expect(answer).toEqual({
      questionId: '1',
      timestamp: '2021-01-01T00:00:00.000Z',
      response: 'No',
    })
  })
})
