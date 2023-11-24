import { CCUProgress } from "../Testing-Templates/CCUProgress";
import { DeliverySuiteProgress } from "../Testing-Templates/DeliverySuiteProgress";
import { EDProgress } from "../Testing-Templates/EDProgress";

const internalTemplates = ["Coronary Care Unit", "Delivery Suite", "Emergency Department", "ICU/PICU", "NICU", "Operating Suite", "Recovery"]

export function TestingProgressTemplate({testingTemplatesData, currentDept}) {
    switch (currentDept) {
        case "Coronary Care Unit":
            return (
                <CCUProgress testingTemplatesData={testingTemplatesData["John Hunter Hospital"][currentDept]} />
            )
        case "Delivery Suite":
            return (
                <DeliverySuiteProgress testingTemplatesData={testingTemplatesData["John Hunter Hospital"][currentDept]} />
            )
        case "Emergency Department":
            return (
                <EDProgress testingTemplatesData={testingTemplatesData["John Hunter Hospital"][currentDept]} />
            )
        default:
            return (
                <div className="flex-c" style={{height: 300 + 'px'}}>
                    <h4 style={{color: "white", gridRow: 1 / -1, gridColumn: 1 / -1}}>{`The template is not yet available for ${currentDept}`}</h4>
                </div>
            )
    }
}