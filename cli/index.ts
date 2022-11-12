import prompts from 'prompts'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { promptQueue } from './personal-data-collection/domain'
import { addDay } from './personal-data-collection/domain/usecases/prompt-queue'

yargs(hideBin(process.argv))
  .scriptName('inquire')
  .usage('$0 <cmd> [args]')
  .command(
    'add <question>',
    'create a recurring question',
    yargs =>
      yargs.positional('question', {
        describe: 'the question to add',
        type: 'string',
      }),
    argv => {
      promptQueue.createRecurringQuestion({ question: argv.question })
    }
  )
  .command('query', 'query for questions', async () => {
    const promptList = await promptQueue.query(addDay(new Date()))
    console.log(promptList)

    const mapPromptsToQuestions = promptList =>
      promptList.map(({ question }, index) => ({
        type: 'toggle',
        name: String(index),
        message: question,
        initial: true,
        active: 'yes',
        inactive: 'no',
      }))

    const response = await prompts(mapPromptsToQuestions(promptList))

    const mapResponseToAnswers = (promptList, response) => {
      return Object.entries(response).map(([index, response]) => {
        const { questionId, timestamp } = promptList[index]
        return {
          questionId,
          response,
          timestamp,
        }
      })
    }

    console.log(mapResponseToAnswers(promptList, response))
  })
  .help().argv
