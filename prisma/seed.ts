import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { exit } from 'process'
import { RecurringQuestions } from '~/self-data-collection/domain/index.server'

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

  await RecurringQuestions.create({
    userId,
    text: 'Did you complete your morning 1h meditation?',
    phase: { timestamp: daysAgo(1), utcOffsetInMinutes },
  })

  await RecurringQuestions.create({
    userId,
    text: 'Did you complete your noon 1h meditation?',
    phase: { timestamp: daysAgo(1), utcOffsetInMinutes },
  })

  await RecurringQuestions.create({
    userId,
    text: 'Did you complete your evening 1h meditation?',
    phase: { timestamp: daysAgo(1), utcOffsetInMinutes },
  })

  const questions = await RecurringQuestions.readAll(userId)

  console.log('========= result of seed: =========')
  prettyPrint({ user })
  prettyPrint(questions)
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
