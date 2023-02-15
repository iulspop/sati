import { Form } from '@remix-run/react'

export default function EditQuestion({ question }) {
  console.log(question)

  return (
    <Form>
      <label htmlFor="question">Question</label>
      <input id="question" name="question" defaultValue={question} />
    </Form>
  )
}
