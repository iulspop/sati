import { Prompt } from '~/domains/self-data-collection/domain/value-objects/prompt'
import { PromptCardComponent } from './prompt-card-component'

export type PromptListComponentProps = {
  promptList: Prompt[]
  timeZone?: string
}

export const groupByDate = (promptList: Prompt[]) =>
  promptList.reduce((promptListGroupedByDate, prompt) => {
    const dateKey = prompt.timestamp.toISOString()
    return {
      ...promptListGroupedByDate,
      [dateKey]: [...(promptListGroupedByDate[dateKey] || []), prompt],
    }
  }, {})

export function PromptListComponent({ promptList, timeZone }: PromptListComponentProps) {
  const groupedPrompts = groupByDate(promptList)

  return (
    <ol>
      {Object.entries(groupedPrompts).map(([date, prompts], index) => {
        const groupId = `group-${index}`
        const headerId = `header-${index}`

        const localDate = new Date(date).toLocaleString('en-US', {
          timeZone: timeZone ?? 'Etc/UTC',
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        })

        return (
          <li key={date} aria-labelledby={headerId} data-testid="date-group">
            <h2 id={headerId}>{localDate}</h2>
            <ol id={groupId}>
              {
                // @ts-ignore
                prompts.map(prompt => (
                  <PromptCardComponent key={prompt.questionId} {...prompt} />
                ))
              }
            </ol>
          </li>
        )
      })}
    </ol>
  )
}
