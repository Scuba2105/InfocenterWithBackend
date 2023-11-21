import { serverConfig } from "../../server"

// array of the available internal templates
const internalTemplates = ["Coronary Care Unit", "Delivery Suite", "Emergency Department", "ICU/PICU", "NICU", "Operating Suite"]

export function TestingProgressTemplates({showTestingTemplate}) {

    return (
        <div className="templates-links-container">        
            {internalTemplates.map((entry, index) => {
                return (
                    <div key={entry} onClick={showTestingTemplate} className={index % 2 === 0 ? "internal-template flex-c-col main-link-button" : "internal-template flex-c-col alternate-link-button"} >
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