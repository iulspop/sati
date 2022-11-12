import { Answer, createAnswer } from '../domain/entities/answer'
import AnswerRepository from '../domain/repositories/answer-repository'

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
