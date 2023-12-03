import { serverConfig } from "../../server";

// Store list of Policies and procedures with service request forms.
const policiesProcedures = {
    "Acceptance & Commissioning": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Acceptance and Commissioning.pdf`,
    "Testing and Tagging": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Testing and Tagging.pdf`,
    "Corrective Maintenance": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Corrective_Maintenance.pdf`,
    "Incident Investigation Report": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Incident Investigation Report.doc`,
    "Orders Process Map": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Orders Process Map.pdf`,
    "Recalls and Safety Alerts": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Recalls and Safety Alerts.pdf`,
    "Recall Flowchart": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Recall Flowchart.pdf`,
    "EMS Recall Process": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/EMS Recall Process.pdf`,
    "Medical Gas Installation": `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Medical Gas Installation.pdf`,
    "Planned Outage Process" : `https://${serverConfig.host}:${serverConfig.port}/administration/policies-procedures/Planned Outage Process.pdf`
};
                                
export function PoliciesProcedures() {
    
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