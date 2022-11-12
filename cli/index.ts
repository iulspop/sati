import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import promptQueue from './personal-data-collection/controllers/cli-to-prompt-queue.js'

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
    promptQueue.createRecurringQuestion
  )
  .command('query', 'query for questions', promptQueue.query)
  .help().argv
