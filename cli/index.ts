import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import {
  createRecurringQuestion,
  createRecurringQuestionsFromFile,
  query,
} from './personal-data-collection/application/cli-prompt-queue.js'

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
    createRecurringQuestion
  )
  .command(
    'add bulk <questions-file-path>',
    'create recurring questions from new line delimited questions file',
    yargs =>
      yargs.positional('question-file-path', {
        describe: 'the relative path to the questions file',
        type: 'string',
      }),
    createRecurringQuestionsFromFile
  )
  .command('query', 'query for questions', query)
  .help().argv
