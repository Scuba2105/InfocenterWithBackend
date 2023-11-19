import { serverConfig } from "../../server"

// array of the available internal templates
const internalTemplates = ["JHH HAPS Tags", "CMN HAPS Tags", "Petty Cash", "JHH AA Room Storage Request", "PROcure Access Request Form", "Kitchen Request Form"]

// Store the list of the links location for the internal request forms.
const templateLinks  = {"JHH HAPS Tags": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/JHH HAPS Tags.doc`,
                        "CMN HAPS Tags": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/CMN HAPS Tags.doc`,
                        "Petty Cash": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/Petty Cash.pdf`,
                        "JHH AA Room Storage Request": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/JHH AA Room Storage Request.docx`,
                        "PROcure Access Request Form": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/PROcure Access Request Form.docx`,
                        "Kitchen Request Form": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/internal-templates/Kitchen Request Form.pdf`}

export function HNETemplates() {

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