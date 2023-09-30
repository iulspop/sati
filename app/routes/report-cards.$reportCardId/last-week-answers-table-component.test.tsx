import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { recurringQuestionFactory } from '~/self-data-collection/domain/entities/recurring-question'
import {
  LastWeekAnswersTableComponent,
  formatDateToTwoDigitMonthAndDay,
  getDaysBetweenDates,
  getDifferenceInDays,
  getPreviousSevenDays,
  type AnswersGroupedByQuestion,
} from './last-week-answers-table-component'

describe('LastWeekAnswersTableComponent()', () => {
  test('given a list of questions', async () => {
    const firstQuestionText = 'Did you complete X'
    const secondQuestionText = 'Did you complete Y'
    const answersGroupedByQuestions: AnswersGroupedByQuestion[] = [
      {
        question: recurringQuestionFactory({
          text: firstQuestionText,
        }),
        answers: [],
      },
      {
        question: recurringQuestionFactory({
          text: secondQuestionText,
        }),
        answers: [],
      },
    ]

    const { container } = render(
      <LastWeekAnswersTableComponent answersGroupedByQuestions={answersGroupedByQuestions} />
    )

    expect(
      screen.getByRole('table', { name: /Last Week's Meditation Tracking/i }),
      'should show a table with an accessible name'
    ).toBeVisible()

    expect(
      container.querySelector('tbody').querySelectorAll('th').length,
      'should be exactly one row header for each question'
    ).toEqual(2)
    expect(
      screen.getByRole('rowheader', { name: firstQuestionText }),
      'should show a row header for the first question'
    ).toBeVisible()
    expect(
      screen.getByRole('rowheader', { name: secondQuestionText }),
      'should show a row header for the second question'
    ).toBeVisible()
  })

  test('given a list of questions created on the same date as the current date', async () => {
    const octoberSecondDate = new Date('2023-10-02T00:00:00Z')
    const lastSevenDaysColumnsHeaderText = ['09/25', '09/26', '09/27', '09/28', '09/29', '09/30', '10/01']
    const currentDateHeaderText = '10/02'

    const questionsCreatedDate = octoberSecondDate
    const currentDate = octoberSecondDate

    const deterministicTestTimeZone = 'Etc/UTC'

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
        timeZone={deterministicTestTimeZone}
      />
    )

    expect(screen.getByText(currentDateHeaderText), 'should show the current date as a column header').toBeVisible()

    expect(
      screen.getByRole('rowheader', { name: 'Empty header for spacing' }),
      'should have an empty spacing header on second row'
    ).toBeInTheDocument()

    // prettier-ignore
    lastSevenDaysColumnsHeaderText.forEach((headerText) => {
      expect(screen.getByRole('columnheader', { name: headerText }), 'should show a column header for each of the last seven days').toBeVisible()
    })

    expect(
      screen.getByRole('rowheader', { name: firstQuestionText }),
      'should a row header for each question'
    ).toBeVisible()
    expect(screen.getByRole('rowheader', { name: secondQuestionText })).toBeVisible()
    expect(screen.getByRole('rowheader', { name: thirdQuestionText })).toBeVisible()

    lastSevenDaysColumnsHeaderText
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

  test(`given a list of questions created on two days before the current date,
        and one "Yes" answer, one "No" answer, and one unanswered question for day one,
        and three unanswered questions for day two`, async () => {
    const octoberSecondDate = new Date('2023-10-02T00:00:00Z')
    const octoberFourthDate = new Date('2023-10-04T00:00:00Z')
    const lastSevenDaysColumnsHeaderText = ['09/27', '09/28', '09/29', '09/30', '10/01', '10/02', '10/03']
    // const currentDateHeaderText = '10/04'

    const questionsCreatedDate = octoberSecondDate
    const currentDate = octoberFourthDate

    const deterministicTestTimeZone = 'Etc/UTC'

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
        timeZone={deterministicTestTimeZone}
      />
    )

    lastSevenDaysColumnsHeaderText.map(
      headerText =>
        expect(
          screen.getByRole('columnheader', { name: headerText }),
          'should show a column header for each of the last seven days'
        ).toBeVisible
    )

    lastSevenDaysColumnsHeaderText
      .slice(0, 5)
      .map(headerText => getAllCellsByColumn(headerText))
      .flat()
      .forEach(cell =>
        expect(cell, 'should mark cells under the 09/26 to 10/01 columns as untracked').toHaveAccessibleName(
          'Untracked data'
        )
      )

    const notTrackedHeaderColSpan = Number(
      screen.getByRole('columnheader', { name: 'Not Tracked' }).getAttribute('colspan')
    )
    expect(notTrackedHeaderColSpan, 'should have a "Not Tracked" column header that spans five columns').toEqual(5)

    const firstDayCountIndex =
      getCellIndex(screen.getByRole('columnheader', { name: '1' })) + notTrackedHeaderColSpan - 1
    const firstDayDateIndex = getCellIndex(screen.getByRole('columnheader', { name: '10/02' }))
    expect(firstDayCountIndex, 'should show the "Days Since Start:" count of 1 above the 10/02 column').toEqual(
      firstDayDateIndex
    )
    // expect(false, 'should mark first question cell under the 10/02 column as "Yes"').toEqual(true)
    // expect(false, 'should mark second question cell under the 10/02 column as "No"').toEqual(true)
    // expect(false, 'should mark third question cell under the 10/02 column as "Unanswered"').toEqual(true)

    const secondDayCountIndex =
      getCellIndex(screen.getByRole('columnheader', { name: '2' })) + notTrackedHeaderColSpan - 1
    const secondDayDateIndex = getCellIndex(screen.getByRole('columnheader', { name: '10/03' }))
    expect(secondDayCountIndex, 'should show the "Days Since Start:" count of 2 above the 10/03 column').toEqual(
      secondDayDateIndex
    )
    // expect(false, 'should mark every cell under the 10/03 column as "Unanswered"').toEqual(true)

    const thirdDayCountIndex =
      getCellIndex(screen.getByRole('columnheader', { name: '3' })) + notTrackedHeaderColSpan - 1
    const thirdDayDateIndex = getCellIndex(screen.getByRole('columnheader', { name: '10/04' }))
    expect(
      thirdDayCountIndex,
      'should show the "Days Since Start:" count of 3 above the 10/04 current date column'
    ).toEqual(thirdDayDateIndex)
    // expect(false, 'should mark every cell under the 10/04 column as "Unanswered"').toEqual(true)
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

const getCellIndex = (cell: HTMLElement): number => Array.from(cell.closest('tr').children).indexOf(cell)

describe('getPreviousSevenDays()', () => {
  test('given a date at first day of the month', () => {
    expect(
      getPreviousSevenDays(new Date('2023-01-01T00:00:00.000Z')),
      'should return list of last seven days in chronological order'
    ).toEqual([
      new Date('2022-12-25T00:00:00.000Z'),
      new Date('2022-12-26T00:00:00.000Z'),
      new Date('2022-12-27T00:00:00.000Z'),
      new Date('2022-12-28T00:00:00.000Z'),
      new Date('2022-12-29T00:00:00.000Z'),
      new Date('2022-12-30T00:00:00.000Z'),
      new Date('2022-12-31T00:00:00.000Z'),
    ])
  })
})

describe('formatDateToTwoDigitMonthAndDay()', () => {
  test('given a date 12/09/2023 UTC and a UTC time zone', () => {
    expect(
      formatDateToTwoDigitMonthAndDay(new Date('2023-12-09T00:00:00Z'), 'Etc/UTC'),
      'should return a formatted date string 12/09'
    ).toEqual('12/09')
  })
  test('given a date 12/09/2023 UTC and a "America/Toronto" time zone', () => {
    expect(
      formatDateToTwoDigitMonthAndDay(new Date('2023-12-09T00:00:00Z'), 'America/Toronto'),
      'should return a formatted date string 12/08 (the date in that timezone given the timestamp)'
    ).toEqual('12/08')
  })
})

describe('getDifferenceInDays()', () => {
  test('given two approximately equal dates', () => {
    expect(
      getDifferenceInDays(new Date(2023, 8, 28, 12, 0, 0, 0), new Date(2023, 8, 28, 12, 0, 0, 4)),
      'should return 0'
    ).toEqual(0)
  })
  test('given a date 2023-12-10 and a date 2023-12-12', () => {
    expect(
      getDifferenceInDays(new Date('2023-12-10T00:00:00Z'), new Date('2023-12-12T00:00:00Z')),
      'should return 2'
    ).toEqual(2)
  })
})

describe('getDaysBetweenDates()', () => {
  test('given two dates on the same day', () => {
    expect(
      getDaysBetweenDates(new Date('2023-01-01'), new Date('2023-01-01')),
      'should return a list starting with day one'
    ).toEqual([1])
  })
  test('given two dates, one 6 days later', () => {
    expect(
      getDaysBetweenDates(new Date('2023-01-01'), new Date('2023-01-07')),
      'should return a list starting with day 1 up to and including day 7'
    ).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
  test('given two dates, one 8 days later', () => {
    expect(
      getDaysBetweenDates(new Date('2023-01-01'), new Date('2023-01-09')),
      'should return a list starting with day 2 up to and including day 9'
    ).toEqual([2, 3, 4, 5, 6, 7, 8, 9])
  })
})
