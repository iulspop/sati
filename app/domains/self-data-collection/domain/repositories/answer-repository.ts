import Answer from '../entities/answer'

export default interface AnswerRepository {
  findMany(): Promise<Answer[]>
  create(answer: Answer): Promise<void>
}
