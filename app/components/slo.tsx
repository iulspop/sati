export interface SLOProps {
  label: string
  targetPercentage: number
  remainingMaxPercentage: number
  missBudget: number
  spentBudget: number
  remainingBudget: number
}

export const SLO = ({
  label,
  targetPercentage,
  remainingMaxPercentage,
  missBudget,
  spentBudget,
  remainingBudget,
}: SLOProps) => (
  <div>
    <p>{label}</p>
    <ul>
      <li>Target: {targetPercentage}</li>
      <li>Max Possible: {remainingMaxPercentage}</li>
      <li>Misses Budget: {missBudget}</li>
      <li>Misses: {spentBudget}</li>
      <li>Remaining: {remainingBudget}</li>
    </ul>
  </div>
)
