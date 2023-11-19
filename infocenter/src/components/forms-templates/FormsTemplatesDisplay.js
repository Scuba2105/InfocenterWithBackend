import { useState } from "react";
import { ServiceRequestForms } from "./ServiceRequestForms";
import { EditIcon } from "../../svg";
import { ModalSkeleton } from "../ModalSkeleton";
import { InternalTemplates } from "./InternalTemplates";
import { UpdateServiceRequestForms } from "./UpdateServiceRequestForm";
import { OnlineRequestForms } from "./OnlineRequestForms";
import { serverConfig } from "../../server";

// Store list of Service Agents with service request forms.
const serviceAgents = ["3M", "Cardinal Health", "Celemetrix", "FM30 Transducers Delivery Note", "Fresenius Kabi", "GE Healthcare", "Generic Delivery Note", "ICU Medical", 
                      "Independent Living Specialists", "JD Healthcare", "Masimo", "Medtronic", "Philips Respironics", "REM Systems", "Resmed",
                      "Verathon", "Welch Allyn"];

// Store list of service agents that use Online request forms.
const onlineForms  = {"Masimo": "https://www.masimo.com/company/global-services/customer-feedback-form/",
                      "Medtronic": "https://secure.medtronicinteract.com/SubmitServiceRequest",
                      "GE Healthcare": "https://services.gehealthcare.com.au/gehcstorefront/",
                      "Welch Allyn": "https://www.welchallyn.com/en/service-support/submit-a-repair.html",
                      "Generic Delivery Note": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/service-requests/Generic Delivery Note.pdf`,
                      "FM30 Transducers Delivery Note": `https://${serverConfig.host}:${serverConfig.port}/forms-templates/service-requests/FM30 US and Toco Transducers.pdf`}

// Open the form to perform updates. 
function showForm(setFormVisible) {
    setFormVisible(true)
}

// Close the update form.
function closeForm(setFormVisible) {
    setFormVisible(false)
}

export function FormsTemplatesDisplay({userFormsTemplates, currentUserId, page, queryClient, showMessage, closeDialog}) {

    const [formVisible, setFormVisible] = useState(false); 
    
    let serviceFormsAvailable = null;
    // Get the service forms available for current user
    if (userFormsTemplates !== undefined) {
        serviceFormsAvailable = userFormsTemplates.serviceFormsAvailable
    }

    // Generate options list for service request form uploads
    const saOptionsList = serviceAgents.filter((entry) => {
        return !onlineForms[entry];
    }) 
    
    return (
        <>
            <div className="forms-templates-container flex-c-col">
                <div className="templates-section flex-c-col">
                    <div className="templates-section-title-container flex-c">
                        <h2 className="template-heading">Service Requests</h2> 
                        <div className="staff-edit-btn flex-c" onClick={() => showForm(setFormVisible)}><EditIcon color="rgb(5, 234, 146)"></EditIcon></div>
                    </div>
                    {serviceFormsAvailable ? <ServiceRequestForms serviceAgents={serviceAgents} onlineForms={onlineForms} serviceFormsAvailable={serviceFormsAvailable} currentUserId={currentUserId} /> :
                    <OnlineRequestForms serviceAgents={serviceAgents} onlineForms={onlineForms} />}              
                </div>
            </div>
            <div className="forms-templates-container flex-c-col">
                <div className="templates-section flex-c-col">
                    <div className="templates-section-title-container flex-c">
                        <h2 className="template-heading">HNECT Internal Templates</h2> 
                    </div>
                    <InternalTemplates />
                </div>
            </div>
            {formVisible && 
                <ModalSkeleton type="service-request-forms" closeModal={() => closeForm(setFormVisible)}>
                    <UpdateServiceRequestForms serviceAgents={saOptionsList} currentUserId={currentUserId} page={page} queryClient={queryClient} showMessage={showMessage} closeForm={() => closeForm(setFormVisible)} closeDialog={closeDialog} />
                </ModalSkeleton>
            }
        </>
        
    )
}