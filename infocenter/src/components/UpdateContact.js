import { useRef } from "react"
import { Input } from "./Input"
import { serverConfig } from "../server";

const namePropertyLookup = {"contact": "Name", "position": "Position", "officePhone": "Office Phone", "dectPhone": "Dect Phone", "mobilePhone": "Mobile Phone"};
const staffObjectProperties = ["contact", "position", "officePhone", "dectPhone", "mobilePhone"];
const vendorObjectProperties = ["contact", "position", "officePhone", "mobilePhone", "email"] 
const staffInputsRegexArray = [/^[a-z ,.'-]+$/i, //Contact
                               /^[a-z &/]+$/i, // Position
                               /^[0-9]{10}$|^[1-9][0-9]{7}$|^[0-9]{5}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}|^[0-9]{2}\s[0-9]{3}\s[0-9]{3}|^\s*$/, // Office Phone (allows empty string) 
                               /^[0-9]{5}$/, // Dect Phone
                               /^0[0-9]{9}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}|^\s*$/, // Mobile Phone (allows empty string)
                               /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$|^\s*$/ // Email (allows empty string)
                            ]; 

const vendorRegexArray = [/^[a-z ,.'-]+$/i, // Contact 
                          /^[a-z ,.'-/]+$/i, // Position
                          /^[0-9]{10}$|^[1-9][0-9]{7}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}|^[0-9]{2}\s[0-9]{3}\s[0-9]{3}|^\s*$/, // Office Phone (allows empty string)
                          /^0[0-9]{9}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}|^\s*$/, // Mobile Phone (allows empty string)
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$|^\s*$/ // Email (allows empty string)
                        ];
const excludedPositions = ["Service Department", "Technical Service", "Customer Service"]

function inputIsValid(formType, index, value, currentContact) {
    
    if (formType === "staff") {
        return staffInputsRegexArray[index].test(value)
    }
    else {
        if (index === 1 && excludedPositions.includes(currentContact.contact)) {
            return true
        }
        else if (index !== 0 && excludedPositions.includes(currentContact.contact)) {
            return vendorRegexArray[index + 1].test(value)
        }
        else {
            return vendorRegexArray[index].test(value)
        }
    }
}

async function uploadUpdatedDetails(idNumber, currentContact, formType, formContainer, updatedContactData, page, pageData, queryClient, showMessage, closeDialog, closeUpdateContactModal) {
    // Check which fields have changed and validate new data.
    const formInputs = formContainer.current.querySelectorAll("input");
    
    // Add the current data to the update data object
    updatedContactData.current = {...currentContact}

    // Check if inputs have changed.
    let changedEntries = [];
    for (let [index, input] of Array.from(formInputs).entries()) {
        
        // Get the required object properties based on form type. 
        const contactObjectProperties = formType === "staff" ? staffObjectProperties : formType === "vendor" && excludedPositions.includes(currentContact.contact) ? vendorObjectProperties.slice(0,1).concat(vendorObjectProperties.slice(2)) : vendorObjectProperties;
        
        // Initialise the number of changes and check how many inputs have been changed. 
        if (currentContact[contactObjectProperties[index]] !== input.value) {
            // Validate the input if it has changed and overwrite the contact data property if valid 
            if (inputIsValid(formType, index, input.value, currentContact)) {
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

    // Add the existing name and officer to the data to identify the entry to update
    updatedContactData.current["existingName"] = currentContact.contact;
    updatedContactData.current["existingPosition"] = currentContact.position;

    // Add the date string to the update data to track when it was added.
    const currentDate = new Date();
    updatedContactData.current["lastUpdate"] = currentDate.toLocaleDateString();
    console.log(updatedContactData)
    // // Start uploading dialog and begin post request
    // showMessage("uploading", `Uploading New Contact Data`);

    // // Start the post request
    // try {
    //     // Post the data to the server  
    //     const res = await fetch(`http://${serverConfig.host}:${serverConfig.port}/UpdateContact/${formType}`, {
    //             method: "POST", // *GET, POST, PUT, DELETE, etc.
    //             mode: "cors", // no-cors, *cors, same-origin
    //             redirect: "follow", // manual, *follow, error
    //             referrerPolicy: "no-referrer",
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(updatedContactData.current),
    //     });

    //     const data = await res.json()

    //     if (data.type === "Error") {
    //         closeDialog();
    //         showMessage("error", `${data.message}. If the issue persists please contact an administrator.`);
    //     }
    //     else {                            
    //         // Need to update app data.
    //         queryClient.invalidateQueries('dataSource');

    //         closeDialog();
    //         showMessage("info", 'Resources have been successfully updated!');
    //         setTimeout(() => {
    //             closeDialog();
    //             closeUpdateContactModal();
    //         }, 1600);
    //     }
    // }
    // catch (error) {
    //     showMessage("error", `${error.message}.`)
    // }
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