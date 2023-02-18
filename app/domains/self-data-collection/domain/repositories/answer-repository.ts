import type { Answer } from '../entities/answer'

export interface AnswerRepositoryAPI {
  create(answer: Answer): Promise<Answer>
  read(id: string): Promise<Answer | null>
  readAll(): Promise<Answer[]>
  update(id: string, partialAnswer: Partial<Answer>): Promise<Answer>
  delete(id: string): Promise<Answer>
}
