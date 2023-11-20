import { serverConfig } from "../../server"

// array of the available internal templates
const internalTemplates = ["AIMS Report", "JHH HAPS Tags", "CMN HAPS Tags", "New Asset Label", "Sold Equipment Flyer"]

// Store the list of the links location for the internal request forms.
const templateLinks  = {"AIMS Report": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/AIMS Report.doc`,
                        "JHH HAPS Tags": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/JHH HAPS Tags.doc`,
                        "CMN HAPS Tags": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/CMN HAPS Tags.doc`,                           
                        "New Asset Label": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/New Asset Label.docx`,
                        "Sold Equipment Flyer": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/Sold Equipment Flyer.docx`}

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