export interface SLOProps {
  label: string
  targetPrecentage: number
  remainingMaxPercentage: number
  missBudget: number
  spentBudget: number
  remainingBudget: number
}

export const SLO = ({
  label,
  targetPrecentage,
  remainingMaxPercentage,
  missBudget,
  spentBudget,
  remainingBudget,
}: SLOProps) => (
  <div>
    <p>{label}</p>
    <ul>
      <li>Target: {targetPrecentage}</li>
      <li>Max Possible: {remainingMaxPercentage}</li>
      <li>Misses Budget: {missBudget}</li>
      <li>Misses: {spentBudget}</li>
      <li>Remaining: {remainingBudget}</li>
    </ul>
  </div>
)
