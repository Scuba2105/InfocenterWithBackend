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
    "TNT": "https://mytnt.tnt.com",
    "Staff Link": "https://envz.cit.health.nsw.gov.au/OA_HTML/AppsLogin",
    "SARA Leave Application": "https://sara.health.nsw.gov.au",
    "CPACS": "http://cpacsweb/",
    "CPAP Pressure Settings": "https://www.apneaboard.com/adjust-cpap-pressure/change-cpap-pressure-settings-adjusting-your-machine-with-a-clinician-setup-manual",
    "My Health Learning": "https://nswhealth.seertechsolutions.com.au",
    "Uniform Orders": "https://nswhss.adaorders.com.au/",
    "ChemAlert": "https://chemalert.rmt.com.au/nswhealthv5/login/"
}

// Store list of common External Applications and their corresponding url.
const workHealthSafetyLinks = {
    "Hazard Inspection Form": `https://${serverConfig.host}:${serverConfig.port}/administration/work-health-safety/Hazard Inspection Form.doc`,
    "Safety Walk Form": `https://${serverConfig.host}:${serverConfig.port}/administration/work-health-safety/Safety Walk Form.doc`,
    "Work Health and Safety Act": `https://${serverConfig.host}:${serverConfig.port}/administration/work-health-safety/Work Health and Safety Act.docx`,
    "WHS Forms, Policies & Procedures" : "https://intranet.hne.health.nsw.gov.au/hr/health_safety_and_insurable_risk/ohs/whs_policies,_procedures,_forms_and_guidelines"     
}

// Create the array for all the AUS/NZ Standards Biomedical Standards and HNE Standards Subscription. 
const australianStandardsLinks = {
    "AS/NZS 3551: Management Programs for Medical Equipment": `https://${serverConfig.host}:${serverConfig.port}/administration/standards/Standards/ASNZS 3551.pdf`,
    "AS/NZS 3200: Approval and Test Specification": `https://${serverConfig.host}:${serverConfig.port}/administration/standards/Standards/ASNZS 3200.pdf`,
    "AS/NZS 3003: Electrical Installation - Patient Areas": `https://${serverConfig.host}:${serverConfig.port}/administration/standards/Standards/ASNZS 3003.pdf`,
    "AS/NZS 2896: Medical Gas Systems -  Installation and Testing": `https://${serverConfig.host}:${serverConfig.port}/administration/standards/Standards/ASNZS 2896.pdf`,
    "AS/NZS 2500: Safe Use of Electricity in Patient Care" : `https://${serverConfig.host}:${serverConfig.port}/administration/standards/Standards/ASNZS 2500.pdf`, 
    "Australian Standards Subscription" : "https://subscriptions.techstreet.com/subscriptions/index",
    "Subscription Registration": "https://www.hnehealthlibraries.com.au/503"    
}

// Create the array of admin page sections and their associated url data.
const adminPageSectionsArray = [
    {section: "Policies and Procedures", linksData: policiesProceduresLinks},
    {section: "External Applications and Websites", linksData: externalApplications},
    {section: "Modification and Fabrication", linksData: modificationFabricationLinks},
    {section: "Work, Health & Safety", linksData: workHealthSafetyLinks},
    {section: "Australian Standards", linksData: australianStandardsLinks},
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