import Answer from '../entities/answer'

export default interface AnswerRepository {
  findMany(): Promise<Array<Answer>>
  create(answer: Partial<Answer>): Promise<void>
}
