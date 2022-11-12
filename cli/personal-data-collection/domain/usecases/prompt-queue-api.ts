import Answer from '../entities/answer'
import Prompt from '../entities/prompt'
import RecurringQuestion from '../entities/recurring-question'

export default interface PromptQueueAPI {
  createRecurringQuestion: (recurringQuestion: Partial<RecurringQuestion>) => Promise<void>
  query: (currentDate?: Date) => Promise<Array<Prompt>>
  answerPrompt: (answer: Answer) => Promise<void>
  getAnswers: () => Promise<Array<Answer>>
}
