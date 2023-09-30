import { z } from 'zod'

export const PromptSchema = z
  .object({
    questionId: z.string(),
    text: z.string(),
    timestamp: z.date(),
  })
  .required()

export type Prompt = z.infer<typeof PromptSchema>
