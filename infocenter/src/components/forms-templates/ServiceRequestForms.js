import { serverConfig } from "../../server";

// Store list of service agents that use Online request forms.
const onlineForms  = {"Masimo": "https://www.masimo.com/company/global-services/customer-feedback-form/",
                      "Medtronic": "https://secure.medtronicinteract.com/SubmitServiceRequest",
                      "GE Healthcare": "https://services.gehealthcare.com.au/gehcstorefront/",
                      "Welch Allyn": "https://www.welchallyn.com/en/service-support/submit-a-repair.html",
                      "Generic Delivery Note": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/service-requests/Generic Delivery Note.pdf`,
                      "FM30 Transducers Delivery Note": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/service-requests/FM30 US and Toco Transducers.pdf`}

// Stores the service agent and request form file type for request forms that aren't pdf.
const nonPdfServiceRequestForms = [{serviceAgent: "Cardinal Health", fileType: "docx"}, 
                                   {serviceAgent: "ICU Medical", fileType: "docx"}];

// Get the correct file extension for the service request form for the selected Service Agent.
function getFileExtension(serviceAgent) {
    const selectedAgentEntry = nonPdfServiceRequestForms.find((entry) => {
        return entry.serviceAgent === serviceAgent;
    }); 

    return selectedAgentEntry !== undefined ? selectedAgentEntry.fileType : "pdf";  
}

export function ServiceRequestForms({serviceAgents, serviceFormsAvailable, currentUserId}) {
    return (
        <div className="templates-links-container">
                    {serviceAgents.map((entry, index) => {
                        if (onlineForms[entry]) {
                            return (
                                <a key={entry} href={onlineForms[entry]} target="_blank" rel="noreferrer" className={index % 2 === 0 ? "template-service-request flex-c-col main-link-button" : "template-service-request flex-c-col alternate-link-button"} >
                                    {typeof entry === "string" ? entry : 
                                        entry.map((word, index2) => {
                                            return <label key={`${entry}-${index2}`}>{word}</label>
                                        })
                                    }
                                </a>
                            )
                        }
                        else {
                            // If service form available render link otherwise render faded div element
                            if (serviceFormsAvailable.includes(entry)) {
                                return (
                                    <a key={entry} href={`https://${serverConfig.host}:${serverConfig.port}/forms-templates/service-requests/${currentUserId}/${entry}.${getFileExtension(entry)}`} target="_blank" rel="noreferrer" download className={index % 2 === 0 ? "template-service-request flex-c-col main-link-button" : "template-service-request flex-c-col alternate-link-button"} >
                                        {typeof entry === "string" ? entry : 
                                            entry.map((word, index2) => {
                                                return <label key={`${entry}-${index2}`}>{word}</label>
                                            })
                                        }
                                    </a>
                                )
                            }
                            else {
                                return (
                                    <div key={entry} className={index % 2 === 0 ? "template-service-request flex-c-col main-link-button unavailable-link" : "template-service-request flex-c-col alternate-link-button unavailable-link"}>
                                        {typeof entry === "string" ? entry : 
                                            entry.map((word, index2) => {
                                                return <label key={`${entry}-${index2}`}>{word}</label>
                                            })
                                        }
                                    </div>
                                )
                            }
                        }
                    })}
                </div> 
    )
}