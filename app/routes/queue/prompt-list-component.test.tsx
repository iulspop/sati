import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { Prompt } from '~/domains/self-data-collection/domain/value-objects/prompt'
import { PromptListComponent } from './prompt-list-component'

describe('PromptList component', () => {
  test('given a list of prompts: renders a list of prompt cards', () => {
    const promptList: Prompt[] = [
      {
        questionId: '1',
        question: 'What is your name?',
        timestamp: new Date('2021-01-01T00:00:00.000Z'),
      },
      {
        questionId: '2',
        question: 'Did you brush your teeth?',
        timestamp: new Date('2021-01-01T00:00:00.000Z'),
      },
    ]

    const RemixStub = createRemixStub([
      {
        path: '/',
        element: <PromptListComponent promptList={promptList} />,
      },
    ])

    render(<RemixStub />)

    const list = screen.getByRole('list')
    expect(list).toBeVisible()
    expect(within(list).getByText(promptList[0].question)).toBeVisible()
    expect(within(list).getByText(promptList[1].question)).toBeVisible()
  })
})
