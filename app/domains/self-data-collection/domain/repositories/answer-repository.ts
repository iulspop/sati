import { Answer } from '../entities/answer'

export interface AnswerRepositoryAPI {
  findMany(): Promise<Answer[]>
  create(answer: Answer): Promise<void>
}
