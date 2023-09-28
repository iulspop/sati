import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { recurringQuestionFactory } from '~/self-data-collection/domain/entities/recurring-question'
import { LastWeekAnswersTableComponent, type AnswersGroupedByQuestion } from './last-week-answers-table-component'

describe('LastWeekAnswersTableComponent()', () => {
  test('given an list of questions created on the same date as the current date', async () => {
    const octoberSecondDate = new Date('2023-10-02T00:00:00Z')
    const questionsCreatedDate = octoberSecondDate
    const currentDate = octoberSecondDate
    const deterministicTestTimezone = 'Etc/UTC'

    const firstQuestionText = 'Did you complete your morning 1h meditation?'
    const secondQuestionText = 'Did you complete your noon 1h meditation?'
    const thirdQuestionText = 'Did you complete your evening 1h meditation?'
    const answersGroupedByQuestions: AnswersGroupedByQuestion[] = [
      {
        question: recurringQuestionFactory({
          text: firstQuestionText,
          timestamp: questionsCreatedDate,
        }),
        answers: [],
      },
      {
        question: recurringQuestionFactory({
          text: secondQuestionText,
          timestamp: questionsCreatedDate,
        }),
        answers: [],
      },
      {
        question: recurringQuestionFactory({
          text: thirdQuestionText,
          timestamp: questionsCreatedDate,
        }),
        answers: [],
      },
    ]

    render(
      <LastWeekAnswersTableComponent
        answersGroupedByQuestions={answersGroupedByQuestions}
        currentDate={currentDate}
        timezone={deterministicTestTimezone}
      />
    )

    expect(
      screen.getByRole('table', { name: /Last Week's Meditation Tracking/i }),
      'should show a table with an accessible name'
    ).toBeVisible()

    const currentDateHeaderText = '10/02'
    expect(screen.getByText(currentDateHeaderText), 'should show the current date as a column header').toBeVisible()

    const lastSevenDaysColumnHeaderText = ['09/25', '09/26', '09/27', '09/28', '09/29', '09/30', '10/01']
    // prettier-ignore
    lastSevenDaysColumnHeaderText.forEach((headerText) => {
      expect(screen.getByRole('columnheader', { name: headerText }), 'should show a column header for each of the last seven days').toBeVisible()
    })

    expect(
      screen.getByRole('rowheader', { name: firstQuestionText }),
      'should a row header for each question'
    ).toBeVisible()
    expect(screen.getByRole('rowheader', { name: secondQuestionText })).toBeVisible()
    expect(screen.getByRole('rowheader', { name: thirdQuestionText })).toBeVisible()

    lastSevenDaysColumnHeaderText
      .map(headerText => getAllCellsByColumn(headerText))
      .flat()
      .forEach(cell =>
        expect(cell, 'should mark untracked every cell under the last 7 days columns').toHaveAccessibleName(
          'Untracked data'
        )
      )

    getAllCellsByColumn(currentDateHeaderText).forEach(cell =>
      expect(cell, 'should mark unanswered every cell under the current date').toHaveAccessibleName('Unanswered')
    )

    expect(
      screen.getByRole('rowheader', { name: 'Days Since Start:' }),
      'should show the "Days Since Start:" row header'
    ).toBeVisible()
    expect(
      screen.getByRole('columnheader', { name: 'Not Tracked' }),
      'should show the "Not Tracked" column header above the last 7 days columns'
    ).toHaveAttribute('colspan', '7')
    expect(
      screen.getByRole('columnheader', { name: '1' }),
      'should show the "Days Since Start:" count of 1 above the current date column'
    ).toBeVisible()
  })
})

const getAllCellsByColumn = (columnHeaderText: string, ignoreFirstRowsCount = 2) => {
  const columnHeader = screen.getByRole('columnheader', { name: columnHeaderText }) as HTMLTableCellElement

  const headersRow = columnHeader.closest('tr')
  const headers = Array.from(headersRow.querySelectorAll('th'))
  const columnIndex = headers.indexOf(columnHeader)

  const allRows = Array.from(screen.getByRole('table').querySelectorAll('tr'))

  return allRows.reduce((columnCells, row, rowIndex) => {
    if (rowIndex <= ignoreFirstRowsCount - 1) return columnCells
    const cell = row.children[columnIndex]
    if (cell === undefined) throw Error('Expected a cell under the column header for every row')
    return [...columnCells, cell]
  }, [])
}
