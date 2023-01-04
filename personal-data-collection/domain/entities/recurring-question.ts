export default interface RecurringQuestion {
  id: string
  question: string
  phases: {
    timestamp: Date
    utcOffsetInMinutes: number
  }[]
}
