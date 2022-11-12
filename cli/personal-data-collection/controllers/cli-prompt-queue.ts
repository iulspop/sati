import prompts from 'prompts'
import { promptQueue } from '../domain/index.js'

const createRecurringQuestion = async argv => await promptQueue.createRecurringQuestion({ question: argv.question })

const query = async () => {
  const promptList = await promptQueue.query()
  const response = await prompts(mapPromptsToQuestions(promptList))
  mapResponseToAnswers(promptList, response).forEach(answer => promptQueue.answerPrompt(answer))
}

const mapPromptsToQuestions = promptList =>
  promptList.map(({ question }, index) => ({
    type: 'toggle',
    name: String(index),
    message: question,
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

export { createRecurringQuestion, query }
