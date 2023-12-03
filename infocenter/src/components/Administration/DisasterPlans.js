import { serverConfig } from "../../server";

// Store list of Policies and procedures with service request forms.
const policiesProcedures = {
    "HNE Health Disaster Plans": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/HNE Health Disaster Plans.pdf`,
    "Disaster Planning and Management": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/Disaster Planning and Management.pdf`,
    "BME Disaster Plan": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/Biomedical Engineering Area Disaster Response Subplan.pdf`,
    "JHH Disaster Plan": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/JHH Disaster Plan.pdf`,
    "JHH Pandemic Response Plan": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/JHH Pandemic Response Plan.pdf`,
    "Emergency Plan for Dangerous Goods": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/Emergency Plan for Dangerous Goods.pdf`,
};
                                
export function DisasterPlans() {
    
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