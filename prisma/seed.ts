import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { exit } from 'process'
import { answerFactory } from '~/self-inquiry/domain/entities/answer'
import { answersService, promptQueueService, recurringQuestionsService } from '~/self-inquiry/domain/index.server'

const prettyPrint = (object: any) => console.log(JSON.stringify(object, undefined, 2))

const prisma = new PrismaClient()

const userId = process.env.SEED_USER_ID

const daysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const utcOffsetInMinutes = new Date().getTimezoneOffset()

async function seed() {
  if (!userId) {
    throw new Error('Please provide a userId to seed.ts')
  }

  const user = await prisma.userProfile.create({
    data: {
      id: userId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
    },
  })

  await recurringQuestionsService.create({
    userId,
    text: 'Did you complete your morning 1h meditation?',
    timestamp: daysAgo(4),
    utcOffsetInMinutes,
  })

  await recurringQuestionsService.create({
    userId,
    text: 'Did you complete your noon 1h meditation?',
    timestamp: daysAgo(4),
    utcOffsetInMinutes,
  })

  await recurringQuestionsService.create({
    userId,
    text: 'Did you complete your evening 1h meditation?',
    timestamp: daysAgo(4),
    utcOffsetInMinutes,
  })

  const questions = await recurringQuestionsService.readAll(userId)

  const prompts = await promptQueueService.query(userId)

  prompts.slice(0, 9).forEach(async ({ questionId, timestamp }) => {
    await answersService.create(answerFactory({ questionId, timestamp, response: Math.floor(Math.random() * 10) % 2 === 1 ? true : false }))
  })

  const answers = await answersService.readAll(userId)

  console.log('========= result of seed: =========')
  prettyPrint(user)
  prettyPrint(questions)
  prettyPrint(answers)
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    exit(1)
  })
