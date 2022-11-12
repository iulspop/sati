import { createRecurringQuestion } from '../domain/entities/recurring-question.js'
import RecurringQuestionRepository from '../domain/repositories/recurring-question-repository.js'
import fs from 'fs'
import path from 'path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const storageDirPath = path.join(__dirname, '..', '..', '..', process.env.STORAGE_PATH)

export default function recurringQuestionRepositoryFileSystem(): RecurringQuestionRepository {
  if (!fs.existsSync(storageDirPath)) fs.mkdirSync(storageDirPath)
  if (!fs.existsSync(path.join(storageDirPath, 'recurring-questions.json')))
    fs.writeFileSync(path.join(storageDirPath, 'recurring-questions.json'), JSON.stringify([]))

  return {
    findMany: async () =>
      JSON.parse(fs.readFileSync(path.join(storageDirPath, 'recurring-questions.json'), 'utf8')).map(recurringQuestion => ({
        ...recurringQuestion,
        startDate: new Date(recurringQuestion.startDate),
      })),
    create: async recurringQuestion => {
      const recurringQuestions = JSON.parse(fs.readFileSync(path.join(storageDirPath, 'recurring-questions.json'), 'utf8'))
      fs.writeFileSync(
        path.join(storageDirPath, 'recurring-questions.json'),
        JSON.stringify([...recurringQuestions, createRecurringQuestion(recurringQuestion)])
      )
    },
  }
}
