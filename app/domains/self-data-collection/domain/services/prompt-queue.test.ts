import { describe } from 'vitest'

import { assert } from '~/test/assert'

import { database } from '../../../database.server'
import { AnswerRepository } from '../../infrastructure/answer-prisma'
import { RecurringQuestionRepository } from '../../infrastructure/recurring-question-prisma'
import type { Answer } from '../entities/answer'
import type { Prompt } from '../value-objects/prompt'
import { Answers } from './answers'
import {
  addDay,
  calculateQuery,
  filterIfCurrentDay,
  keepUnlessPromptAnswered,
  PromptQueue,
  sortByDay,
  toDayList,
  toLocalTime,
  toStartOfDay,
} from './prompt-queue'
import { RecurringQuestions } from './recurring-questions'

describe('promptQueue()', async () => {
  {
    await database.recurringQuestion.deleteMany()

    const recurringQuestions = RecurringQuestions(RecurringQuestionRepository())
    const answers = Answers(AnswerRepository())
    const promptQueue = PromptQueue(recurringQuestions)(answers)

    const startDate = new Date('2022-10-20T01:00:00.000Z')
    const startDateLocal = new Date('2022-10-19T20:00:00.000Z')
    const startOfDayInLocalTime = new Date('2022-10-19T05:00:00.000Z')

    const firstDayPrompt: Prompt = {
      questionId: '1',
      question: 'Did you study 2 hours?',
      timestamp: startOfDayInLocalTime,
    }

    const secondDayPrompt: Prompt = {
      questionId: '1',
      question: 'Did you study 2 hours?',
      timestamp: addDay(startOfDayInLocalTime),
    }

    const firstDayAnswer: Answer = {
      id: '1',
      questionId: '1',
      timestamp: new Date(startOfDayInLocalTime),
      response: true,
    }

    await recurringQuestions.create({
      id: '1',
      question: 'Did you study 2 hours?',
      phase: {
        timestamp: startDate,
        utcOffsetInMinutes: 5 * 60,
      },
    })

    assert({
      given: 'a recurring question and a query in two days local time',
      should: 'return two prompts, one for each day except the current day',
      actual: await promptQueue.query(addHours(28, startDateLocal)),
      expected: [firstDayPrompt, secondDayPrompt],
    })

    await answers.create(firstDayAnswer)

    assert({
      given: 'one prompt answered',
      should: 'return one answer',
      actual: await answers.readAll(),
      expected: [firstDayAnswer],
    })

    assert({
      given: 'a prompt answered',
      should: 'not show the prompt again',
      actual: await promptQueue.query(addHours(28, startDateLocal)),
      expected: [secondDayPrompt],
    })
  }
  {
    await database.recurringQuestion.deleteMany()

    const recurringQuestions = RecurringQuestions(RecurringQuestionRepository())
    const answers = Answers(AnswerRepository())
    const promptQueue = PromptQueue(recurringQuestions)(answers)

    const startTime = new Date('2022-10-22T00:00:00.000Z')
    const queryTime = new Date('2022-10-23T00:00:00.000Z')

    await recurringQuestions.create({
      id: '2',
      order: 2,
      question: 'Have you studied?',
      phase: {
        timestamp: startTime,
        utcOffsetInMinutes: 0,
      },
    })

    await recurringQuestions.create({
      id: '1',
      order: 1,
      question: 'Have you eaten broccoli?',
      phase: {
        timestamp: startTime,
        utcOffsetInMinutes: 0,
      },
    })

    assert({
      given: 'two recurring questions',
      should: 'return prompts in order of the questions',
      actual: await promptQueue.query(queryTime),
      expected: [
        {
          questionId: '1',
          question: 'Have you eaten broccoli?',
          timestamp: startTime,
        },
        {
          questionId: '2',
          question: 'Have you studied?',
          timestamp: startTime,
        },
      ],
    })
  }
})

describe('calculateQuery()', () => {
  {
    const startTimeUTC = new Date('2022-10-22T01:00:00.000Z')
    const queryTimeLocal = new Date('2022-10-22T00:00:00.000Z')

    assert({
      given: 'a recurring question created at 20:00 local time and a query the next day at 00:00 local time',
      should: 'return one prompt',
      actual: calculateQuery(
        [
          {
            id: '1',
            order: 1,
            question: 'Have you studied?',
            phase: {
              timestamp: startTimeUTC,
              utcOffsetInMinutes: 5 * 60,
            },
          },
        ],
        [],
        queryTimeLocal
      ),
      expected: [
        {
          questionId: '1',
          question: 'Have you studied?',
          timestamp: new Date('2022-10-21T05:00:00.000Z'),
        },
      ],
    })
  }
  {
    const startTime = new Date('2022-10-22T00:00:00.000Z')
    const queryTime = new Date('2022-10-24T00:00:00.000Z')

    assert({
      given: 'two recurring questions and a prompt in two days',
      should: 'return prompts ordered by day',
      actual: calculateQuery(
        [
          {
            id: '1',
            order: 1,
            question: 'Have you studied?',
            phase: {
              timestamp: startTime,
              utcOffsetInMinutes: 0,
            },
          },
          {
            id: '2',
            order: 2,
            question: 'Did you eat your vegetables?',
            phase: {
              timestamp: startTime,
              utcOffsetInMinutes: 0,
            },
          },
        ],
        [],
        queryTime
      ),
      expected: [
        {
          questionId: '1',
          question: 'Have you studied?',
          timestamp: new Date('2022-10-22T00:00:00.000Z'),
        },
        {
          questionId: '2',
          question: 'Did you eat your vegetables?',
          timestamp: new Date('2022-10-22T00:00:00.000Z'),
        },
        {
          questionId: '1',
          question: 'Have you studied?',
          timestamp: new Date('2022-10-23T00:00:00.000Z'),
        },
        {
          questionId: '2',
          question: 'Did you eat your vegetables?',
          timestamp: new Date('2022-10-23T00:00:00.000Z'),
        },
      ],
    })
  }
})

describe('sortByDay()', () => {
  assert({
    given: 'an unordered list of prompts',
    should: 'return prompts ordered by day',
    actual: sortByDay([
      {
        questionId: '1',
        question: 'Have you studied?',
        timestamp: new Date('2022-10-22T00:00:00.000Z'),
      },
      {
        questionId: '1',
        question: 'Have you studied?',
        timestamp: new Date('2022-10-23T00:00:00.000Z'),
      },
      {
        questionId: '2',
        question: 'Did you eat your vegetables?',
        timestamp: new Date('2022-10-23T00:00:00.000Z'),
      },
      {
        questionId: '2',
        question: 'Did you eat your vegetables?',
        timestamp: new Date('2022-10-22T00:00:00.000Z'),
      },
    ]),
    expected: [
      {
        questionId: '1',
        question: 'Have you studied?',
        timestamp: new Date('2022-10-22T00:00:00.000Z'),
      },
      {
        questionId: '2',
        question: 'Did you eat your vegetables?',
        timestamp: new Date('2022-10-22T00:00:00.000Z'),
      },
      {
        questionId: '1',
        question: 'Have you studied?',
        timestamp: new Date('2022-10-23T00:00:00.000Z'),
      },
      {
        questionId: '2',
        question: 'Did you eat your vegetables?',
        timestamp: new Date('2022-10-23T00:00:00.000Z'),
      },
    ],
  })
})

describe('keepUnlessPromptAnswered()', () => {
  const answer: Answer = {
    id: '1',
    questionId: '1',
    response: true,
    timestamp: new Date('2022-10-19T10:00:00.000Z'),
  }

  const prompt: Prompt = {
    questionId: '1',
    question: 'Did you study 2 hours?',
    timestamp: new Date('2022-10-19T15:00:00.000Z'),
  }

  assert({
    given: 'an answer and a prompt at different times',
    should: 'not filter prompt',
    actual: keepUnlessPromptAnswered([answer])([prompt]),
    expected: [prompt],
  })

  const answerAtSameTime: Answer = {
    id: '1',
    questionId: '1',
    response: true,
    timestamp: new Date('2022-10-19T15:00:00.000Z'),
  }

  assert({
    given: 'an answer and a prompt at the same time',
    should: 'filter prompt',
    actual: keepUnlessPromptAnswered([answerAtSameTime])([prompt]),
    expected: [],
  })
})

describe('filterIfCurrentDay()', () => {
  const firstDayPrompt: Prompt = {
    questionId: '1',
    question: 'Did you study 2 hours?',
    timestamp: new Date('2022-10-19T05:00:00.000Z'),
  }

  const secondDayPrompt: Prompt = {
    questionId: '1',
    question: 'Did you study 2 hours?',
    timestamp: new Date('2022-10-20T05:00:00.000Z'),
  }

  assert({
    given: 'a query on the 21st and prompts on the 19th and 20th',
    should: 'return the prompts on the 19th and 20th',
    actual: filterIfCurrentDay(new Date('2022-10-21T00:00:00.000Z'))([firstDayPrompt, secondDayPrompt]),
    expected: [firstDayPrompt, secondDayPrompt],
  })
})

describe('toDayList()', () => {
  const startDate = new Date(2022, 9, 22, 0, 0, 0, 0)
  const endDate = new Date(2022, 9, 24, 0, 0, 0, 0)

  assert({
    given: 'a date and another date 2 days after',
    should: 'return a list of 3 dates',
    actual: toDayList(startDate, endDate),
    expected: [startDate, addDay(startDate), endDate],
  })

  assert({
    given: 'a date and another date 5 hours after',
    should: 'return one day',
    actual: toDayList(startDate, new Date(2022, 9, 22, 5, 0, 0, 0)),
    expected: [startDate],
  })

  assert({
    given: 'a date and another date 25 hours after',
    should: 'return two days, second day exactly 24 hours after first day',
    actual: toDayList(startDate, new Date(2022, 9, 23, 1, 0, 0, 0)),
    expected: [startDate, addDay(startDate)],
  })
})

describe('toStartOfDay()', () => {
  assert({
    given: 'a date at 8PM',
    should: 'return a date at 12AM the same day',
    actual: toStartOfDay(new Date('2022-10-19T20:01:01.500Z')),
    expected: new Date('2022-10-19T00:00:00.000Z'),
  })
})

describe('toLocalTime()', () => {
  assert({
    given: 'a date at 1AM and a UTC offset of -5 hours (EST)',
    should: 'return a date at 8PM the previous day',
    actual: toLocalTime({
      timestamp: new Date('2022-10-20T01:00:00.000Z'),
      utcOffsetInMinutes: 5 * 60,
    }),
    expected: new Date('2022-10-19T20:00:00.000Z'),
  })

  assert({
    given: 'a date at 8PM and a UTC offset of 2 hours (Bucharest)',
    should: 'return a date at 10PM the same day',
    actual: toLocalTime({
      timestamp: new Date('2022-10-20T20:00:00.000Z'),
      utcOffsetInMinutes: -2 * 60,
    }),
    expected: new Date('2022-10-20T22:00:00.000Z'),
  })
})

const addHours = (hours: number, date: Date) => {
  const newDate = new Date(date)
  newDate.setHours(newDate.getHours() + hours)
  return newDate
}
