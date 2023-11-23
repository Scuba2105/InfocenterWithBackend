import { CCUProgress } from "../Testing-Templates/CCUProgress"

const internalTemplates = ["Coronary Care Unit", "Delivery Suite", "Emergency Department", "ICU/PICU", "NICU", "Operating Suite"]

export function TestingProgressTemplate({currentDept}) {
    console.log(currentDept)
    if (currentDept === "Coronary Care Unit")
    return (
        <CCUProgress />
    )
}