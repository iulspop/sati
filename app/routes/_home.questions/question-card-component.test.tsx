import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import type { RecurringQuestion } from '~/self-data-collection/domain/entities/recurring-question'
import { QuestionCardComponent } from './question-card-component'

describe('QuestionCard component', () => {
  test('given a recurring question: render question text inside list item', async () => {
    const recurringQuestion: RecurringQuestion = {
      userId: '1',
      id: '1',
      order: 1,
      question: 'Did you go to bed between 8 and 9PM?',
      phase: {
        timestamp: new Date(),
        utcOffsetInMinutes: -300,
      },
    }

    render(<QuestionCardComponent {...recurringQuestion} />)

    const listItem = screen.getByRole('listitem')
    const questionText = within(listItem).getByText(recurringQuestion.question)

    expect(questionText).toBeInTheDocument()
  })
})
