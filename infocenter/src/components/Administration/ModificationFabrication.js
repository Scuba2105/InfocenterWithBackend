import { serverConfig } from "../../server";

// Store list of Policies and procedures with service request forms.
const modificationFabricationResources = {
    "Request Form": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Modification-Fabrication Request.doc`,
    "Decision Chart": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Modification-Fabrication Decision Chart.docx`,
    "Request Assessment Form": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Modification-Fabrication Request Assessment.doc`,
    "Design Control Process": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Design Control Process.doc`,
    "Production Process": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Production Process.doc`,
    "Request Assessment Example": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Worked Example-Work request assessment.doc`
};
                                
export function ModificationFabrication() {
    
    const documentsArray = []; 
    
    for (const [key, value] of Object.entries(modificationFabricationResources)) {
        documentsArray.push(key);
    }
    
    return (
        <div className="templates-links-container">        
            {documentsArray.map((entry, index) => {
                return (
                    <a key={entry} href={modificationFabricationResources[entry]} target="_blank" rel="noreferrer" download className={index % 2 === 0 ? "internal-template flex-c-col main-link-button" : "internal-template flex-c-col alternate-link-button"} >
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