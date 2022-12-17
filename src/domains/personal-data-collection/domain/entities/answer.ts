import cuid from 'cuid'

export default interface Answer {
  id: string
  questionId: string
  response: boolean
  timestamp: Date
}

const createAnswer = ({ id = cuid(), questionId = 'N/A', response = false, timestamp = new Date() }): Answer => ({
  id,
  questionId,
  response,
  timestamp,
})

export { Answer, createAnswer }
