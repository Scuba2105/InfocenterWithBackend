import { useState } from "react";
import { ServiceRequestForms } from "./ServiceRequestForms";
import { UploadIcon } from "../../svg";
import { ModalSkeleton } from "../ModalSkeleton";
import { InternalTemplates } from "./InternalTemplates";
import { HNETemplates } from "./HNETemplates";
import { UpdateServiceRequestForms } from "./UpdateServiceRequestForm";
import { OnlineRequestForms } from "./OnlineRequestForms";
import { TestingProgressLinks } from "./TestingProgressLinks";
import { TestingProgressSkeleton } from "./TestingProgressSkeleton";
import { JHHTestingProgressTemplates } from "./Testing-Templates/JHHTestingProgressTemplates";
import { Tooltip } from "../Tooltip";
import { MainButton } from "../MainButton";
import { serverConfig } from "../../server";

// Store list of Service Agents with service request forms.
const serviceAgents = ["3M", "Cardinal Health", "Celemetrix", "Device Technologies", "Draeger", "FM30 Transducers Delivery Note", "Fresenius Kabi", "GE Healthcare", "Generic Delivery Note", "ICU Medical", 
                      "Independent Living Specialists", "JD Healthcare", "Masimo", "Medtronic", "Philips Respironics", "REM Systems", "Resmed",
                      "Verathon", "Welch Allyn"];

// Store list of service agents that use Online request forms.
const onlineForms  = {"Masimo": "https://www.masimo.com/company/global-services/customer-feedback-form/",
                      "Medtronic": "https://secure.medtronicinteract.com/SubmitServiceRequest",
                      "GE Healthcare": "https://services.gehealthcare.com.au/gehcstorefront/",
                      "Welch Allyn": "https://www.welchallyn.com/en/service-support/submit-a-repair.html",
                      "Verathon": "https://www.verathon.com/contact-technical-support",
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

// Open the form to perform updates. 
function showTestingTemplate(setTestingTemplateVisible) {
    setTestingTemplateVisible(true)
}

// Close the update form.
function closeTestingTemplate(setTestingTemplateVisible) {
    setTestingTemplateVisible(false)
}

function setTestingDept(setTestingDepartment, department) {
    setTestingDepartment(department)
}

function ButtonComponent({onMouseOver, onClick, onMouseOut}) {
    return (
        <MainButton buttonSize="30px" Image={UploadIcon} imageColor="#D4FB7C" size="15px" onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}/>
    )
}

export function FormsTemplatesDisplay({userFormsTemplates, testingTemplatesData, currentUserId, page, queryClient, showMessage, closeDialog}) {
    
    const [formVisible, setFormVisible] = useState(false);
    const [testingTemplateVisible, setTestingTemplateVisible] = useState(false); 
    const [testingDepartment, setTestingDepartment] = useState(null);
    
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
                        <h2 className="template-heading">Service Request Forms</h2>
                        <Tooltip content="Upload Form" xPos="35px" yPos="-10px" btnTranslateX="-50px" ButtonComponent={ButtonComponent} onClick={() => showForm(setFormVisible)} />
                    </div>
                    {serviceFormsAvailable ? <ServiceRequestForms serviceAgents={serviceAgents} onlineForms={onlineForms} serviceFormsAvailable={serviceFormsAvailable} currentUserId={currentUserId} /> :
                    <OnlineRequestForms serviceAgents={serviceAgents} onlineForms={onlineForms} />}              
                </div>
            </div>
            <div className="forms-templates-container flex-c-col">
                <div className="templates-section flex-c-col">
                    <div className="templates-section-title-container flex-c">
                        <h2 className="template-heading">JHH Testing Progress Forms</h2>
                    </div>
                    <TestingProgressLinks testingTemplatesData={testingTemplatesData} showTestingTemplate={showTestingTemplate} setTestingTemplateVisible={setTestingTemplateVisible} setTestingDepartment={setTestingDepartment} setTestingDept={setTestingDept} />
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
            <div className="forms-templates-container flex-c-col">
                <div className="templates-section flex-c-col">
                    <div className="templates-section-title-container flex-c">
                        <h2 className="template-heading">HNE Templates</h2>
                    </div>
                    <HNETemplates />
                </div>
            </div>
            {formVisible && 
                <ModalSkeleton type="service-request-forms" closeModal={() => closeForm(setFormVisible)}>
                    <UpdateServiceRequestForms serviceAgents={saOptionsList} currentUserId={currentUserId} page={page} queryClient={queryClient} showMessage={showMessage} closeForm={() => closeForm(setFormVisible)} closeDialog={closeDialog} />
                </ModalSkeleton>
            }
            {testingTemplateVisible && 
                <TestingProgressSkeleton  currentDept={testingDepartment} closeModal={() => closeTestingTemplate(setTestingTemplateVisible)}>
                    <JHHTestingProgressTemplates testingTemplatesData={testingTemplatesData} currentDept={testingDepartment} queryClient={queryClient} showMessage={showMessage} closeModal={() => closeTestingTemplate(setTestingTemplateVisible)} closeDialog={closeDialog}/>
                </TestingProgressSkeleton> 
            }
        </>
        
    )
}