import { serverConfig } from "../../server"

// array of the available internal templates
const internalTemplates = ["Coronary Care Unit", "Delivery Suite", "Emergency Department", "ICU/PICU", "NICU", "Operating Suite"]

// Store the list of the links location for the internal request forms.
const templateLinks  = {}

export function TestingProgressTemplates() {

    return (
        <div className="templates-links-container">        
            {internalTemplates.map((entry, index) => {
                return (
                    <a key={entry} href={templateLinks[entry]} target="_blank" rel="noreferrer" download className={index % 2 === 0 ? "internal-template flex-c-col main-link-button" : "internal-template flex-c-col alternate-link-button"} >
                        {typeof entry === "string" ? entry : 
                            entry.map((word, index) => {
                                return <label key={`${entry}-${index}`}>{word}</label>
                            })
                        }
                    </a>
                )
            })}
        </div>
    )
}