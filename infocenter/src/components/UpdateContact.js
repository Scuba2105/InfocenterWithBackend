import { useRef } from "react"
import { Input } from "./Input"

const namePropertyLookup = {"contact": "Name", "position": "Position", "officePhone": "Office Phone", "dectPhone": "Dect Phone", "mobilePhone": "Mobile Phone"};
const staffObjectProperties = ["contact", "position", "officePhone", "dectPhone", "mobilePhone"];
const vendorObjectProperties = ["contact", "position", "officePhone", "mobilePhone", "email"] 
const staffInputsRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z &\/]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$|^[0-9]{5}$/, /^[0-9]{5}$/, /^0[0-9]{9}$/, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/];
const vendorRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z ,.'-]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$/, /^0[0-9]{9}$/, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/];


function inputIsValid(formType, index, value) {
    if (formType === "staff") {
        return staffInputsRegexArray[index].test(value)
    }
    else {
        return vendorRegexArray[index].test(value)
    }
}

function uploadUpdatedDetails(idNumber, currentContact, formType, formContainer, updatedContactData, page, pageData, queryClient, showMessage, closeDialog, closeUpdateContactModal) {
    // Check which fields have changed and validate new data.
    const formInputs = formContainer.current.querySelectorAll("input");
    
    // Add the current data to the update data object
    updatedContactData.current = {...currentContact}

    // Check if inputs have changed.
    let changedEntries = [];
    for (let [index, input] of Array.from(formInputs).entries()) {
        
        // Get the required object properties based on form type. 
        const contactObjectProperties = formType === "staff" ? staffObjectProperties : vendorObjectProperties;
        
        // Initialise the number of changes and check how many inputs have been changed. 
        if (currentContact[contactObjectProperties[index]] !== input.value) {
            // Validate the input if it has changed and overwrite the contact data property if valid 
            if (inputIsValid(formType, index, input.value)) {
                updatedContactData.current[contactObjectProperties[index]] = input.value
                changedEntries.push(contactObjectProperties[index]);
            }
            else {
                showMessage("warning", `The changed input ${namePropertyLookup[contactObjectProperties[index]]} is not valid. Please ensure it is a valid input and try again.`)
                return;
            }
        }
    }
    
    // Check if no inputs have been changed
    if (changedEntries.length === 0) {
        showMessage("warning", "No inputs have been changed for this contact. Please update the required input fields and try again.")
        return
    }

    // May not be necessary. Might be able to send some old data to find old entry.
    if (changedEntries.includes("contact") && changedEntries.includes("position")) {
        showMessage("warning", `The Contact Name and Position cannot both be changed as at least one is required to identify the updated entry. If you do need to update both have an administrator add a new contact for this ${formType === "staff" ? "department" : "vendor"}.`)
    }

    // Now can send data to server.
}

export function UpdateContact({currentContact, formType, page, pageData, queryClient, showMessage, closeDialog, closeUpdateContactModal}) {
    
    const formContainer = useRef(null);
    const updatedContactData = useRef({});
    
    return (
        <div className="contact-update-display">
            <div className="contact-update-department-container">
                {formType === "staff" && <label>{currentContact.data.hospital}</label>}
                {formType === "staff" && <label>{currentContact.data.department}</label>}
                {formType === "vendor" && <label>{currentContact.data.vendor}</label>}
            </div>
            <div className="contact-update-input-container" ref={formContainer}>
                <Input inputType="text" identifier="add-new" type="update" labelText="Current Contact Name" defaultValue={currentContact.data.contact} />
                {currentContact.data.position !== "" && <Input inputType="text" identifier="add-new" type="update" labelText="Current Contact Position" defaultValue={currentContact.data.position} />}
                <Input inputType="text" identifier="add-new" labelText="Office Phone" type="update" defaultValue={currentContact.data.officePhone !== "" ? currentContact.data.officePhone : null} placeholdertext={currentContact.data.officePhone === "" ? "Enter Office Phone number" : null} />
                {formType === "staff" && <Input inputType="text" identifier="add-new" type="update" labelText="Dect Phone" defaultValue={currentContact.data.dectPhone !== "" ? currentContact.data.dectPhone : null} placeholdertext={currentContact.data.dectPhone === "" ? "Enter Dect Phone number" : null} />}
                <Input inputType="text" identifier="add-new" labelText="Mobile Phone" type="update" defaultValue={currentContact.data.mobilePhone !== "" ? currentContact.data.mobilePhone : null} placeholdertext={currentContact.data.mobilePhone === "" ? "Enter Mobile Phone number" : null} />
                {formType === "vendor" && <Input inputType="text" identifier="add-new" type="update" labelText={currentContact.data.vendor === "GE Healthcare" && currentContact.data.contact === "Technical Service" ? "Website" : "Email Address"} defaultValue={currentContact.data.email !== "" ? currentContact.data.email : null} placeholdertext={currentContact.data.email === "" ? "Enter Email Address" : null} />}
            </div>
            <div className={"form-buttons-laptop"} style={formType === "staff" ? {transform: 'translateY(-10px)'} : currentContact.data.position !== "" ? {transform: 'translateY(-20px)'} : {transform: 'translateY(-40px)'}}>
                <div className="update-button" onClick={() => uploadUpdatedDetails(currentContact.id, currentContact.data, formType, formContainer, updatedContactData, page, pageData, queryClient, showMessage, closeDialog, closeUpdateContactModal)}>Upload Updates</div>
            </div>
        </div>
    )
}