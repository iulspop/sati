import Answer from '../domain/entities/answer'
import AnswerRepository from '../domain/repositories/answerRepository'

export default function answerRepositoryInMemory(): AnswerRepository {
  let answers: Answer[] = []

  return {
    async findMany() {
      return answers
    },
    async create(answer: Answer) {
      answers = [...answers, answer]
    },
  }
}
