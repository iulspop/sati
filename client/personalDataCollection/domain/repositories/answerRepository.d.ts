import Answer from '../entities/answer'

export default interface AnswerRepository {
  findAll(): Promise<Array<Answer>>
  save(answer: Answer): Promise<void>
}
