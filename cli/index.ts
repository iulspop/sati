import prompts from 'prompts'
import { promptQueue } from './personal-data-collection/domain'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv))

argv.scriptName('inquire').command(
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

const promptList = promptQueue.query

const response = await prompts({
  type: 'number',
  name: 'value',
  message: 'How old are you?',
  validate: value => (value < 18 ? `Nightclub is 18+ only` : true),
})

console.log(response) // => { value: 24 }
