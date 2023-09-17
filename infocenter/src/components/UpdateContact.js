import { useRef } from "react"
import { Input } from "./Input"

function uploadUpdatedDetails(currentContact, formContainer, updatedContactData) {
    // Check which fields have changed and validate new data 
    const formInputs = formContainer.current.querySelectorAll("input");
}

export function UpdateContact({currentContact, formType, page, pageData, queryClient, showMessage, closeDialog, closeUpdateContactModal}) {
    
    const formContainer = useRef(null);
    const updatedContactData = useRef({});
    
    return (
        <div className="contact-update-display">
            <div className="contact-update-department-container">
                {formType === "staff" && <label>{currentContact.hospital}</label>}
                {formType === "staff" && <label>{currentContact.department}</label>}
                {formType === "vendor" && <label>{currentContact.vendor}</label>}
            </div>
            <div className="contact-update-input-container" ref={formContainer}>
                <Input inputType="text" identifier="add-new" type="update" labelText="Current Contact Name" defaultValue={currentContact.contact} />
                {currentContact.position !== "" && <Input inputType="text" identifier="add-new" type="update" labelText="Current Contact Position" defaultValue={currentContact.position} />}
                <Input inputType="text" identifier="add-new" labelText="Office Phone" type="update" defaultValue={currentContact.officePhone !== "" ? currentContact.officePhone : null} placeholdertext={currentContact.officePhone === "" ? "Enter Office Phone number" : null} />
                {formType === "staff" && <Input inputType="text" identifier="add-new" type="update" labelText="Dect Phone" defaultValue={currentContact.dectPhone !== "" ? currentContact.dectPhone : null} placeholdertext={currentContact.dectPhone === "" ? "Enter Dect Phone number" : null} />}
                <Input inputType="text" identifier="add-new" labelText="Mobile Phone" type="update" defaultValue={currentContact.mobilePhone !== "" ? currentContact.mobilePhone : null} placeholdertext={currentContact.mobilePhone === "" ? "Enter Mobile Phone number" : null} />
                {formType === "vendor" && <Input inputType="text" identifier="add-new" type="update" labelText={currentContact.vendor === "GE Healthcare" && currentContact.contact === "Technical Service" ? "Website" : "Email Address"} defaultValue={currentContact.email !== "" ? currentContact.email : null} placeholdertext={currentContact.email === "" ? "Enter Email Address" : null} />}
            </div>
            <div className={"form-buttons-laptop"} style={formType === "staff" ? {transform: 'translateY(-10px)'} : currentContact.position !== "" ? {transform: 'translateY(-20px)'} : {transform: 'translateY(-40px)'}}>
                <div className="update-button" onClick={() => uploadUpdatedDetails(currentContact, formContainer, updatedContactData)}>Upload Updates</div>
            </div>
        </div>
    )
}