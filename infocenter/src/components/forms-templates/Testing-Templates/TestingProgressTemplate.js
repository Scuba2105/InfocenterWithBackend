import { CCUProgress } from "../Testing-Templates/CCUProgress"

const internalTemplates = ["Coronary Care Unit", "Delivery Suite", "Emergency Department", "ICU/PICU", "NICU", "Operating Suite"]

export function TestingProgressTemplate({testingTemplatesData, currentDept}) {
    switch (currentDept) {
        case "Coronary Care Unit":
            return (
                <CCUProgress testingTemplatesData={testingTemplatesData["John Hunter Hospital"][currentDept]} />
            )
        default:
            return (
                <div className="flex-c" style={{height: 300 + 'px'}}>
                    <h4 style={{color: "white", gridRow: 1 / -1, gridColumn: 1 / -1}}>{`The template is not yet available for ${currentDept}`}</h4>
                </div>
            )
    }
        
        /*case 'Mangoes':
        case 'Papayas':
          console.log('Mangoes and papayas are $2.79 a pound.');
          // Expected output: "Mangoes and papayas are $2.79 a pound."
          break;
        default:*/
}