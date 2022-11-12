import prompts from 'prompts'
import { addDay } from '../domain/usecases/prompt-queue'
import { promptQueue } from '../domain'

const cliToPromptQueue = {
  createRecurringQuestion: async argv => await promptQueue.createRecurringQuestion({ question: argv.question }),
  query: async () => {
    const promptList = await promptQueue.query(addDay(new Date()))

    const mapPromptsToQuestions = promptList =>
      promptList.map(({ question }, index) => ({
        type: 'toggle',
        name: String(index),
        message: question,
        initial: true,
        active: 'yes',
        inactive: 'no',
      }))

    const response: { '0': boolean } = await prompts(mapPromptsToQuestions(promptList))

    const mapResponseToAnswers = (promptList, response: { '0': boolean }) =>
      Object.entries(response).map(([index, response]) => {
        const { questionId, timestamp } = promptList[index]
        return {
          questionId,
          response,
          timestamp,
        }
      })

    mapResponseToAnswers(promptList, response).forEach(answer => promptQueue.answerPrompt(answer))
  },
}

export default cliToPromptQueue
