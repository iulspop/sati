import AnswerRepository from '../domain/repositories/answer-repository.js'
import { createAnswer } from '../domain/entities/answer.js'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  // const newQuestions = await prisma.recurringQuestion.create({
  //   data: {
  //     question: 'Have you studied today?',
  //     utcOffsetInMinutes: 120
  //   },
  // })

  // console.log(newQuestion)
  //

  const questions = await prisma.recurringQuestion.findMany();
  console.log(questions);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

// export default function answerRepositoryFileSystem(): AnswerRepository {
//   if (!fs.existsSync(storageDirPath)) fs.mkdirSync(storageDirPath)
//   if (!fs.existsSync(path.join(storageDirPath, 'answers.json')))
//     fs.writeFileSync(path.join(storageDirPath, 'answers.json'), JSON.stringify([]))

//   return {
//     findMany: async () =>
//       JSON.parse(fs.readFileSync(path.join(storageDirPath, 'answers.json'), 'utf8')).map(answer => ({
//         ...answer,
//         timestamp: new Date(answer.timestamp),
//       })),
//     create: async answer => {
//       const answers = JSON.parse(fs.readFileSync(path.join(storageDirPath, 'answers.json'), 'utf8'))
//       fs.writeFileSync(path.join(storageDirPath, 'answers.json'), JSON.stringify([...answers, createAnswer(answer)], null, 2))
//     },
//   }
// }
