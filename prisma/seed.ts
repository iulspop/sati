import 'dotenv/config'

import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { exit } from 'process'

import { RecurringQuestions } from '~/domains/self-data-collection/domain'

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
      name: faker.name.fullName(),
    },
  })

  await RecurringQuestions.create({
    question: 'Did you go to bed at 9:30PM?',
    phase: { timestamp: daysAgo(3), utcOffsetInMinutes },
  })

  await RecurringQuestions.create({
    question: 'Did you eat last meal by 3PM?',
    phase: { timestamp: daysAgo(2), utcOffsetInMinutes },
  })

  const questions = await RecurringQuestions.readAll()

  console.log('========= result of seed: =========')
  prettyPrint({ user })
  prettyPrint(questions)
}

seed()
  .then(async () => {
    await prisma.$disconnect()
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    exit(1)
  })
