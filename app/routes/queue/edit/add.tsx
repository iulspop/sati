import { Form } from '@remix-run/react'

export default function EditQuestion() {
  return (
    <Form>
      <label htmlFor="question">Question</label>
      <input id="question" name="question" />
    </Form>
  )
}
