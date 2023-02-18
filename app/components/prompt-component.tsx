import { useFetcher } from '@remix-run/react'

export const Prompt = ({ timestamp, questionId, question }) => {
  const fetcher = useFetcher()

  const onYes = () => fetcher.submit({ response: 'true', questionId, timestamp }, { method: 'post' })
  const onNo = () => fetcher.submit({ response: 'false', questionId, timestamp }, { method: 'post' })

  return (
    <li>
      <h3>{question}</h3>
      <button onClick={onYes}>Yes</button>
      <button onClick={onNo}>No</button>
    </li>
  )
}
