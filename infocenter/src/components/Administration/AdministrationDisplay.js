import { serverConfig } from "../../server";

// Store list of Policies and procedures with service request forms.
const policiesProcedures = {"Acceptance & Commissioning": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Acceptance and Commissioning.pdf`,
                            "Corrective Maintenance": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Corrective_Maintenance.pdf`};
                               
export function AdministrationDisplay({queryClient, showMessage, closeDialog}) {
    
    const documentsArray = []; 
    
    for (const [key, value] of Object.entries(policiesProcedures)) {
        documentsArray.push(key);
    }
    
    return (
        <div className="templates-links-container">        
            {documentsArray.map((entry, index) => {
                return (
                    <a key={entry} href={policiesProcedures[entry]} target="_blank" rel="noreferrer" download className={index % 2 === 0 ? "internal-template flex-c-col main-link-button" : "internal-template flex-c-col alternate-link-button"} >
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