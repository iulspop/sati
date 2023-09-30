import { z } from 'zod'

export const PromptSchema = z.object({
  questionId: z.string(),
  text: z.string(),
  timestamp: z.string().transform(str => new Date(str)),
})

export type Prompt = z.infer<typeof PromptSchema>
