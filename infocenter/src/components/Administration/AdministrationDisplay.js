import { AdminLinksSection } from "./AdminLinksSection";
import { serverConfig } from "../../server";

// Store list of Policies and Procedures and their corresponding locations.
const policiesProceduresLinks = {
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

// Store list of Modification and Fabrication documents and their corresponding locations.
const modificationFabricationLinks = {
    "Request Form": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Modification-Fabrication Request.doc`,
    "Decision Chart": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Modification-Fabrication Decision Chart.docx`,
    "Request Assessment Form": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Modification-Fabrication Request Assessment.doc`,
    "Design Control Process": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Design Control Process.doc`,
    "Production Process": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Production Process.doc`,
    "Request Assessment Example": `https://${serverConfig.host}:${serverConfig.port}/administration/fabrication/Worked Example-Work request assessment.doc`
};

// Store list of Disaster Plans documents and their corresponding locations.
const disasterPlansLinks = {
    "HNE Health Disaster Plans": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/HNE Health Disaster Plans.pdf`,
    "Disaster Planning and Management": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/Disaster Planning and Management.pdf`,
    "BME Disaster Plan": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/Biomedical Engineering Area Disaster Response Subplan.pdf`,
    "JHH Disaster Plan": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/JHH Disaster Plan.pdf`,
    "JHH Pandemic Response Plan": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/JHH Pandemic Response Plan.pdf`,
    "Emergency Plan for Dangerous Goods": `https://${serverConfig.host}:${serverConfig.port}/administration/disaster-plans/Emergency Plan for Dangerous Goods.pdf`,
};

// Store list of common External Applications and their corresponding url.
const externalApplications = {
    "Staff Link": "https://envz.cit.health.nsw.gov.au/OA_HTML/AppsLogin",
    "SARA Leave Application": "https://sara.health.nsw.gov.au",
    "CPACS": "http://cpacsweb/",
    "My Health Learning": "https://nswhealth.seertechsolutions.com.au",
    "Uniform Orders": "https://nswhss.adaorders.com.au/",
    "ChemAlert": "https://chemalert.rmt.com.au/nswhealthv5/login/"
}

// Create the array of admin page sections and their associated url data.
const adminPageSectionsArray = [
    {section: "Policies and Procedures", linksData: policiesProceduresLinks},
    {section: "External Applications", linksData: externalApplications},
    {section: "Modification and Fabrication", linksData: modificationFabricationLinks},
    {section: "Disaster Plans", linksData: disasterPlansLinks}
]

export function AdministrationDisplay({queryClient, showMessage, closeDialog}) {
    
    return (
        <>
            {adminPageSectionsArray.map((entry) => {
                return (
                    <div key={entry.section} className="forms-templates-container flex-c-col">
                        <div className="templates-section flex-c-col">
                            <div className="templates-section-title-container flex-c">
                                <h2 className="template-heading">{entry.section}</h2>
                            </div>
                            <AdminLinksSection documentLinksObject={entry.linksData} />
                        </div>
                    </div>
                )
            })}
        </>
    )
}