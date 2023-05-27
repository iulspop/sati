import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import type { Prompt } from '~/self-data-collection/domain/value-objects/prompt'
import { PromptListComponent, groupByDate } from './prompt-list-component'

describe('PromptList component', () => {
  test('given a list of prompts: groups them by time', () => {
    const promptList: Prompt[] = [
      {
        questionId: 'mup7faxpldjb4gnjes2kwb55',
        question: 'Did you go to bed at 9:30PM?',
        timestamp: new Date('2023-04-12T03:00:00.000Z'),
      },
      {
        questionId: 'mup7faxpldjb4gnjes2kwb55',
        question: 'Did you go to bed at 9:30PM?',
        timestamp: new Date('2023-04-13T03:00:00.000Z'),
      },
      {
        questionId: 'q2wdaogkt89mwwymk81ykegc',
        question: 'Did you eat last meal by 3PM?',
        timestamp: new Date('2023-04-13T03:00:00.000Z'),
      },
      {
        questionId: 'mup7faxpldjb4gnjes2kwb55',
        question: 'Did you go to bed at 9:30PM?',
        timestamp: new Date('2023-04-14T03:00:00.000Z'),
      },
      {
        questionId: 'q2wdaogkt89mwwymk81ykegc',
        question: 'Did you eat last meal by 3PM?',
        timestamp: new Date('2023-04-14T03:00:00.000Z'),
      },
    ]

    const RemixStub = createRemixStub([
      { path: '/', element: <PromptListComponent promptList={promptList} timeZone="Etc/UTC" /> },
    ])

    render(<RemixStub />)

    const dateGroups = screen.getAllByTestId('date-group')
    expect(dateGroups).toHaveLength(3)

    const groupOne = within(screen.getByRole('listitem', { name: 'April 12, 2023' }))
    expect(groupOne.getByRole('listitem')).toBeInTheDocument()
    expect(groupOne.getByText(promptList[0].question)).toBeVisible()

    const groupTwo = within(screen.getByRole('listitem', { name: 'April 13, 2023' }))
    expect(groupTwo.getAllByRole('listitem')).toHaveLength(2)
    expect(groupTwo.getByText(promptList[1].question)).toBeVisible()
    expect(groupTwo.getByText(promptList[2].question)).toBeVisible()

    const groupThree = within(screen.getByRole('listitem', { name: 'April 14, 2023' }))
    expect(groupThree.getAllByRole('listitem')).toHaveLength(2)
    expect(groupThree.getByText(promptList[3].question)).toBeVisible()
    expect(groupThree.getByText(promptList[4].question)).toBeVisible()
  })

  test('given a list of prompts and a different timezone: groups them by time shifted to local time', () => {
    const promptList: Prompt[] = [
      {
        questionId: 'mup7faxpldjb4gnjes2kwb55',
        question: 'Did you go to bed at 9:30PM?',
        timestamp: new Date('2023-04-12T03:00:00.000Z'),
      },
      {
        questionId: 'mup7faxpldjb4gnjes2kwb55',
        question: 'Did you go to bed at 9:30PM?',
        timestamp: new Date('2023-04-13T03:00:00.000Z'),
      },
      {
        questionId: 'q2wdaogkt89mwwymk81ykegc',
        question: 'Did you eat last meal by 3PM?',
        timestamp: new Date('2023-04-13T03:00:00.000Z'),
      },
      {
        questionId: 'mup7faxpldjb4gnjes2kwb55',
        question: 'Did you go to bed at 9:30PM?',
        timestamp: new Date('2023-04-14T03:00:00.000Z'),
      },
      {
        questionId: 'q2wdaogkt89mwwymk81ykegc',
        question: 'Did you eat last meal by 3PM?',
        timestamp: new Date('2023-04-14T03:00:00.000Z'),
      },
    ]

    const RemixStub = createRemixStub([
      { path: '/', element: <PromptListComponent promptList={promptList} timeZone="America/New_York" /> },
    ])

    render(<RemixStub />)

    const dateGroups = screen.getAllByTestId('date-group')
    expect(dateGroups).toHaveLength(3)

    const groupOne = within(screen.getByRole('listitem', { name: 'April 11, 2023' }))
    expect(groupOne.getByRole('listitem')).toBeInTheDocument()
    expect(groupOne.getByText(promptList[0].question)).toBeVisible()

    const groupTwo = within(screen.getByRole('listitem', { name: 'April 12, 2023' }))
    expect(groupTwo.getAllByRole('listitem')).toHaveLength(2)
    expect(groupTwo.getByText(promptList[1].question)).toBeVisible()
    expect(groupTwo.getByText(promptList[2].question)).toBeVisible()

    const groupThree = within(screen.getByRole('listitem', { name: 'April 13, 2023' }))
    expect(groupThree.getAllByRole('listitem')).toHaveLength(2)
    expect(groupThree.getByText(promptList[3].question)).toBeVisible()
    expect(groupThree.getByText(promptList[4].question)).toBeVisible()
  })
})

describe('groupByDate()', () => {
  test('given a list of prompts: groups them by date', () => {
    const promptList: Partial<Prompt>[] = [
      { timestamp: new Date('2023-04-15T00:00:00Z') },
      { timestamp: new Date('2023-04-15T00:00:00Z') },
      { timestamp: new Date('2023-04-16T00:00:00Z') },
    ]

    const expectedResult = {
      '2023-04-15T00:00:00.000Z': [
        { timestamp: new Date('2023-04-15T00:00:00Z') },
        { timestamp: new Date('2023-04-15T00:00:00Z') },
      ],
      '2023-04-16T00:00:00.000Z': [{ timestamp: new Date('2023-04-16T00:00:00Z') }],
    }

    // @ts-expect-error
    expect(groupByDate(promptList)).toEqual(expectedResult)
  })

  test('given an empty list of prompts: returns an empty object', () => {
    const promptList: Prompt[] = []
    const expectedResult = {}

    expect(groupByDate(promptList)).toEqual(expectedResult)
  })

  test('given a list of prompts with different time but same date: groups them by different timestamps', () => {
    const promptList: Partial<Prompt>[] = [
      { timestamp: new Date('2023-04-15T00:00:00Z') },
      { timestamp: new Date('2023-04-15T01:00:00Z') },
      { timestamp: new Date('2023-04-15T02:00:00Z') },
    ]

    const expectedResult = {
      '2023-04-15T00:00:00.000Z': [{ timestamp: new Date('2023-04-15T00:00:00Z') }],
      '2023-04-15T01:00:00.000Z': [{ timestamp: new Date('2023-04-15T01:00:00Z') }],
      '2023-04-15T02:00:00.000Z': [{ timestamp: new Date('2023-04-15T02:00:00Z') }],
    }

    // @ts-expect-error
    expect(groupByDate(promptList)).toEqual(expectedResult)
  })
})
