import Answer from '../domain/entities/answer'
import AnswerRepository from '../domain/repositories/answerRepository'

export default function answerRepositoryInMemory(): AnswerRepository {
  let answers: Answer[] = []

  return {
    async findAll() {
      return answers
    },
    async save(answer: Answer) {
      answers = [...answers, answer]
    },
  }
}
