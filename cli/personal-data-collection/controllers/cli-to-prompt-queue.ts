import prompts from 'prompts'
import { addDay } from '../domain/usecases/prompt-queue.js'
import { promptQueue } from '../domain/index.js'

const cliToPromptQueue = {
  createRecurringQuestion: async argv => await promptQueue.createRecurringQuestion({ question: argv.question }),
  query: async () => {
    const promptList = await promptQueue.query(addDay(new Date()))
    const response: { '0': boolean } = await prompts(mapPromptsToQuestions(promptList))
    mapResponseToAnswers(promptList, response).forEach(answer => promptQueue.answerPrompt(answer))
  },
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

const mapResponseToAnswers = (promptList, response: { '0': boolean }) =>
  Object.entries(response).map(([index, response]) => {
    const { questionId, timestamp } = promptList[index]
    return {
      questionId,
      response,
      timestamp,
    }
  })

export default cliToPromptQueue
