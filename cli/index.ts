import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { createRecurringQuestion, query } from './personal-data-collection/controllers/cli-prompt-queue.js'

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
  .command('query', 'query for questions', query)
  .help().argv
