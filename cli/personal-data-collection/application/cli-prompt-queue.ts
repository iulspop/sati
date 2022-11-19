import fs from 'fs'
import prompts from 'prompts'
import { promptQueue } from '../domain/index.js'

const createRecurringQuestion = async argv =>
  await promptQueue.createRecurringQuestion({
    question: argv.question,
    phases: [
      {
        timestamp: new Date(),
        utcOffsetInMinutes: new Date().getTimezoneOffset(),
      },
    ],
  })

const createRecurringQuestionsFromFile = async argv => {
  const questions = fs
    .readFileSync(argv.questionsFilePath, 'utf8')
    .split('\n')
    .filter(string => string.length > 0)
  questions.forEach(question => promptQueue.createRecurringQuestion({ question }))
}

const query = async () => {
  const promptList = await promptQueue.query()
  const response = await prompts(mapPromptsToQuestions(promptList))
  mapResponseToAnswers(promptList, response).forEach(answer => promptQueue.answerPrompt(answer))
}

const mapPromptsToQuestions = promptList =>
  promptList.map(({ question, timestamp }, index) => ({
    type: 'toggle',
    name: String(index),
    message: `${timestamp}: ${question}`,
    initial: true,
    active: 'yes',
    inactive: 'no',
  }))

const mapResponseToAnswers = (promptList, response) =>
  Object.entries(response).map(([index, response]: [string, any]) => {
    const { questionId, timestamp } = promptList[index]
    return {
      questionId,
      response,
      timestamp,
    }
  })

export { createRecurringQuestion, createRecurringQuestionsFromFile, query }
