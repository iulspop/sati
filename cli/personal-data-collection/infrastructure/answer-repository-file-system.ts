import AnswerRepository from '../domain/repositories/answer-repository.js'
import { createAnswer } from '../domain/entities/answer.js'
import fs from 'fs'
import path from 'path'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
const storageDirPath = path.join(__dirname, '..', '..', '..', process.env.STORAGE_PATH)

export default function answerRepositoryFileSystem(): AnswerRepository {
  if (!fs.existsSync(storageDirPath)) fs.mkdirSync(storageDirPath)
  if (!fs.existsSync(path.join(storageDirPath, 'answers.json')))
    fs.writeFileSync(path.join(storageDirPath, 'answers.json'), JSON.stringify([]))

  return {
    findMany: async () =>
      JSON.parse(fs.readFileSync(path.join(storageDirPath, 'answers.json'), 'utf8')).map(answer => ({
        ...answer,
        timestamp: new Date(answer.timestamp),
      })),
    create: async answer => {
      const answers = JSON.parse(fs.readFileSync(path.join(storageDirPath, 'answers.json'), 'utf8'))
      fs.writeFileSync(path.join(storageDirPath, 'answers.json'), JSON.stringify([...answers, createAnswer(answer)], null, 2))
    },
  }
}
