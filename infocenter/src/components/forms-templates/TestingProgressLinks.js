import { serverConfig } from "../../server"

// array of the available internal templates
//const internalTemplates = ["CCU", "Delivery Suite", "Emergency Department", "ICU/PICU", "NICU", "Operating Suite", "Recovery"];

export function TestingProgressLinks({testingTemplatesData, showTestingTemplate, setTestingTemplateVisible, setTestingDepartment, setTestingDept}) {

    function updateTestingTemplateState(dept) {
        showTestingTemplate(setTestingTemplateVisible);
        setTestingDept(setTestingDepartment, dept)
    }

    const internalTemplates = Object.keys(testingTemplatesData["John Hunter Hospital"])

    return (
        <div className="templates-links-container">        
            {internalTemplates.map((entry, index) => {
                return (
                    <div key={entry} onClick={() => updateTestingTemplateState(entry)} className={index % 2 === 0 ? "internal-template flex-c-col main-link-button" : "internal-template flex-c-col alternate-link-button"} >
                        {typeof entry === "string" ? entry : 
                            entry.map((word, index) => {
                                return <label key={`${entry}-${index}`}>{word}</label>
                            })
                        }
                    </div>
                )
            })}
        </div>
    )
}