import { useState } from "react";
import { ServiceRequestForms } from "./ServiceRequestForms";
import { EditIcon } from "../../svg";
import { ModalSkeleton } from "../ModalSkeleton";
import { UpdateServiceRequestForms } from "./UpdateServiceRequestForm";

// Store list of Service Agents with service request forms.
const serviceAgents = ["3M", "Cardinal Health", "Celemetrix", "FM30 Transducers Delivery Note", "Fresenius Kabi", "GE Healthcare", "Generic Delivery Note", "ICU Medical", 
                      "Independent Living Specialists", "JD Healthcare", "Masimo", "Medtronic", "Philips Respironics", "REM Systems", "Resmed",
                      "Verathon", "Welch Allyn"];

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

    // Get the service forms available for current user
    const serviceFormsAvailable = userFormsTemplates.serviceFormsAvailable

    return (
        <>
            <div className="forms-templates-container flex-c-col">
                <div className="templates-section flex-c-col">
                    <div className="templates-section-title-container flex-c">
                        <h2 className="template-heading">Service Requests</h2> 
                        <div className="staff-edit-btn flex-c" onClick={() => showForm(setFormVisible)}><EditIcon color="rgb(5, 234, 146)"></EditIcon></div>
                    </div>
                    <ServiceRequestForms serviceAgents={serviceAgents} serviceFormsAvailable={serviceFormsAvailable} currentUserId={currentUserId} />               
                </div>
            </div>
            {formVisible && 
                <ModalSkeleton type="service-request-forms" closeModal={() => closeForm(setFormVisible)}>
                    <UpdateServiceRequestForms serviceAgents={serviceAgents} currentUserId={currentUserId} page={page} queryClient={queryClient} showMessage={showMessage} closeForm={closeForm} closeDialog={closeDialog} />
                </ModalSkeleton>
            }
        </>
        
    )
}