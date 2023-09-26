import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import type { Answer } from '~/self-data-collection/domain/entities/answer'
import { answerFactory } from '~/self-data-collection/domain/entities/answer'
import { QuestionsAnswersTableComponent } from './question-answers-table-component'

describe('EditQuestionFormComponent()', () => {
  test('given a list of answers sorted chronologically: render table of answer dates and responses in reverse chronological order', async () => {
    const answers: Answer[] = [
      answerFactory({ timestamp: new Date('2023-01-01T00:00:00.000Z'), response: true }),
      answerFactory({ timestamp: new Date('2023-09-20T00:00:00.000Z'), response: false }),
      answerFactory({ timestamp: new Date('2023-09-21T00:00:00.000Z'), response: true }),
    ]

    render(
      <QuestionsAnswersTableComponent
        answers={answers}
        // Makes date formatting deterministic relative to UTC, regardless of tester timezone
        fixTimezone={date => new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000)}
      />
    )

    const expectedRows = [
      { expectedDate: '21/09/2023', expectedResponse: 'True' },
      { expectedDate: '20/09/2023', expectedResponse: 'False' },
      { expectedDate: '01/01/2023', expectedResponse: 'True' },
    ]

    const tableRows = screen.getAllByRole('row').slice(1)

    try {
      expectedRows.forEach(({ expectedDate, expectedResponse }, index) => {
        const answerRow = tableRows[index]

        const dateCell = within(answerRow).getByText(expectedDate)
        const responseCell = within(answerRow).getByText(expectedResponse)

        expect(dateCell).toBeInTheDocument()
        expect(responseCell).toBeInTheDocument()
      })
    } catch (error) {
      // Print the entire rendered table when test fails
      // eslint-disable-next-line
      console.error(screen.debug())
      throw error
    }
  })

  test('given a list of answers: render question answers header', async () => {
    const answers: Answer[] = [answerFactory({ timestamp: new Date('2023-01-01T00:00:00.000Z'), response: true })]

    render(<QuestionsAnswersTableComponent answers={answers} />)

    expect(screen.getByRole('heading', { name: /Question Answers/i, level: 2 }))
  })
})
