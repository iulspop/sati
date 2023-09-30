import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { answersService, recurringQuestionsService } from '~/self-inquiry/domain/index.server'
import { AnswersGroupedByQuestionsSchema, LastWeekAnswersTableComponent } from './last-week-answers-table-component'

export const loader = async () => {
  const iuliuUserId = process.env.SEED_USER_ID ?? 'did:ethr:0xf4B78934DDe5fD83c131A0D500d8c361d5dc54F7'
  const recurringQuestions = await recurringQuestionsService.readAll(iuliuUserId)

  return json(
    await Promise.all(
      recurringQuestions.map(async recurringQuestion => ({
        question: recurringQuestion,
        answers: await answersService.readAllByQuestionId(recurringQuestion.id),
      }))
    )
  )
}

export default function Page() {
  const answersGroupedByQuestions = AnswersGroupedByQuestionsSchema.parse(useLoaderData<typeof loader>())

  return (
    <div className="p-8 bg-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">Iuliu's Meditation Practice</h1>
      <p className="text-xl mb-4">How's my meditation practice going?</p>
      <h2 className="text-2xl text-green-500 my-2">2 Week Streak Out Of 104 Week Goal</h2>
      <p className="text-lg mb-6">Number of weeks Iuliu meditated on average two one hour sessions over the week.</p>
      <LastWeekAnswersTableComponent answersGroupedByQuestions={answersGroupedByQuestions} />
    </div>
  )
}
