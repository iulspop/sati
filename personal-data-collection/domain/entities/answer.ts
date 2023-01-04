export default interface Answer {
  id: string
  questionId: string
  response: boolean
  timestamp: Date
}

const createAnswer = ({
  id = '123',
  questionId = 'N/A',
  response = false,
  timestamp = new Date(),
}): Answer => ({
  id,
  questionId,
  response,
  timestamp,
})

export { Answer, createAnswer }
