import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'

import { Prompt } from '~/domains/self-data-collection/domain/value-objects/prompt'

import { PromptCardComponent } from './prompt-card-component'

describe('PromptCard component', () => {
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

    const yesButton = await screen.findByLabelText(`Answer "${prompt.question}" with Yes`)
    expect(yesButton).toHaveTextContent('Yes')

    const noButton = await screen.findByLabelText(`Answer "${prompt.question}" with No`)
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
        },
      },
    ])

    const user = userEvent.setup()
    render(<RemixStub />)

    const yesButton = await screen.findByLabelText(`Answer "${prompt.question}" with Yes`)
    await user.click(yesButton)

    expect([...formData.entries()]).toEqual([
      ['questionId', '1'],
      ['timestamp', '2021-01-01T00:00:00.000Z'],
      ['answer', 'Yes'],
    ])
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
        },
      },
    ])

    const user = userEvent.setup()
    render(<RemixStub />)

    const noButton = await screen.findByLabelText(`Answer "${prompt.question}" with No`)
    await user.click(noButton)

    expect([...formData.entries()]).toEqual([
      ['questionId', '1'],
      ['timestamp', '2021-01-01T00:00:00.000Z'],
      ['answer', 'No'],
    ])
  })
})
