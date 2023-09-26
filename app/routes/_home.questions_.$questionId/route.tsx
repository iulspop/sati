import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { requireUserIsAuthenticated } from '~/routes/_auth/user-authentication-session.server'
import type { Answer } from '~/self-data-collection/domain/entities/answer'
import type { RecurringQuestion } from '~/self-data-collection/domain/entities/recurring-question'
import { answersService, recurringQuestionsService } from '~/self-data-collection/domain/index.server'
import type { DeleteQuestionFormEntries } from './edit-question-form-component'
import { EditQuestionFormComponent } from './edit-question-form-component'
import { QuestionsAnswersTableComponent } from './question-answers-table-component'

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserIsAuthenticated(request)
  const pathSegments = new URL(request.url).pathname.split('/')
  const questionId = pathSegments[pathSegments.length - 1]
  const recurringQuestion = await recurringQuestionsService.read(questionId)
  const answers = (await answersService.readAll(userId)).filter(answer => answer.questionId === questionId)
  return json({ recurringQuestion, answers })
}

export const action = async ({ request }: ActionArgs) => {
  await requireUserIsAuthenticated(request)
  const formData = await request.formData()
  // @ts-expect-error
  const deleteQuestionFormEntries: DeleteQuestionFormEntries = Object.fromEntries(formData.entries())
  await recurringQuestionsService.delete(deleteQuestionFormEntries.questionId)
  return redirect('/questions')
}

export const meta: V2_MetaFunction<typeof loader> = () => [{ title: 'Questions | Inquire' }]

export default function CreateQuestionPage() {
  const { recurringQuestion: serializedRecurringQuestion, answers: serializedAnswers } = useLoaderData<typeof loader>()

  // @ts-expect-error
  const recurringQuestion: RecurringQuestion = {
    ...serializedRecurringQuestion,
    timestamp: new Date(serializedRecurringQuestion.timestamp),
  }
  // @ts-expect-error
  const answers: Answer[] = serializedAnswers.map(serializedAnswer => ({
    ...serializedAnswer,
    timestamp: new Date(serializedAnswer.timestamp),
  }))

  return (
    <>
      <EditQuestionFormComponent {...recurringQuestion} />
      <QuestionsAnswersTableComponent answers={answers} />
    </>
  )
}
