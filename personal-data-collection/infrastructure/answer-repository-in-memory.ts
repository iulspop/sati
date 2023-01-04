import { Answer, createAnswer } from '../domain/entities/answer.js'
import AnswerRepository from '../domain/repositories/answer-repository.js'

export default function answerRepositoryInMemory(): AnswerRepository {
  let answers: Answer[] = []

  return {
    async findMany() {
      return answers
    },
    async create(answer: Answer) {
      answers = [...answers, createAnswer(answer)]
    },
  }
}
