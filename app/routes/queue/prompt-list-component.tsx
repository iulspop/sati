import { Prompt } from '~/domains/self-data-collection/domain/value-objects/prompt'
import { PromptCardComponent } from './prompt-card-component'

export type PromptListComponentProps = {
  promptList: Prompt[]
}

export function PromptListComponent({ promptList }: PromptListComponentProps) {
  return (
    <ol>
      {promptList.map(prompt => (
        <PromptCardComponent key={prompt.questionId} {...prompt} />
      ))}
    </ol>
  )
}
