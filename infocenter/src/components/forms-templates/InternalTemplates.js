import { serverConfig } from "../../server"

// array of the available internal templates
const internalTemplates = ["AIMS Report", "HAPS Labels", "Kitchen", "Petty Cash"]

// Store list of service agents that use Online request forms.
const templateLinks  = {"AIMS Report Template": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/AIMS Report Template.doc`}

export function InternalTemplates() {

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