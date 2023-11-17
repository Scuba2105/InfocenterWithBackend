import { serverConfig } from "../../server";

const serviceAgents = ["3M", "B Braun", "Cardinal Health", "Celemetrix", "Fresenius Kabi", "GE Healthcare", "Generic Delivery Note", "ICU Medical", 
                      "Independent Living Specialists", "JD Healthcare", "Masimo", "Medtronic", "Neomedix", "Philips Respironics", "REM Systems", "Resmed",
                      "Verathon", "Welch Allyn"];

const onlineForms  = {"Masimo": "https://www.masimo.com/company/global-services/customer-feedback-form/",
                      "Medtronic": "https://secure.medtronicinteract.com/SubmitServiceRequest",
                      "GE Healthcare": "https://services.gehealthcare.com.au/gehcstorefront/",
                      "Welch Allyn": "https://www.welchallyn.com/en/service-support/submit-a-repair.html"}

export function FormsTemplatesDisplay({userFormsTemplates, currentUserId}) {

    // Get the service forms available for current user
    const serviceFormsAvailable = userFormsTemplates.serviceFormsAvailable

    console.log(serviceFormsAvailable);
    
    return (
        <div className="forms-templates-container flex-c-col">
            <div className="templates-section flex-c-col">
                <h2 className="template-heading">Service Requests</h2>
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
                                    <a key={entry} href={`https://${serverConfig.host}:${serverConfig.port}/forms-templates/service-requests/${currentUserId}/${entry}.pdf`} target="_blank" rel="noreferrer" download className={index % 2 === 0 ? "template-service-request flex-c-col main-link-button" : "template-service-request flex-c-col alternate-link-button"} >
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
            </div>
        </div>
    )
}