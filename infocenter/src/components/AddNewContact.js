import { useState, useRef } from "react"
import { Input } from "./Input";
import { serverConfig } from "../server";

// Regex for name, position, primary phone, dect, mobile phone, and vendor email
const inputsRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z ]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$/, /^[0-9]{5}$/, /^0[0-9]{9}$/g, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/] 

function updatePage(staffInputPage, setStaffInputPage, e) {
    if (e.currentTarget.classList.contains("config-left-arrow") && staffInputPage === 2) {
        setStaffInputPage(1);
    }
    else if (e.currentTarget.classList.contains("config-right-arrow") && staffInputPage === 1) {
        setStaffInputPage(2);
    }
}
    

function uploadNewContact(inputContainer, formType) {
    const inputs = inputContainer.current.querySelectorAll("input");
    const staffRegexArray = inputsRegexArray.slice(0, 5);
    const vendorRegexArray = inputsRegexArray.slice(0, 3).concat(inputsRegexArray.slice(4)); 
    
    inputs.forEach((input, index) => {
        if (formType === "vendor") {
            console.log(vendorRegexArray[index].test(input.value), vendorRegexArray[index]);
        }
        else {
            console.log(staffRegexArray[index].test(input.value), staffRegexArray[index]);
        }
    })
}

export function AddNewContact({formType}) {
    
    const [staffInputPage, setStaffInputPage] = useState(1);
    const inputContainer = useRef(null);

    if (formType === "staff") {
        return (
            <div className="contact-modal-display">
                <div className="contact-indicator-container">
                    <div className={staffInputPage === 1 ? "indicator active-indicator" : "indicator"}></div>
                    <div className={staffInputPage === 2 ? "indicator active-indicator" : "indicator"}></div>
                </div>
                <div className="staff-contacts-input-container" style={staffInputPage === 2 ? {transform: 'translateY(31px)'} : null}>
                    <img className="config-arrow config-left-arrow" onClick={(e) => updatePage(staffInputPage, setStaffInputPage, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="left-arrow"></img>
                    <div className="add-new-input-container" ref={inputContainer}>
                        {staffInputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Name" placeholdertext={`Enter new contact name`} />}
                        {staffInputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Position" placeholdertext="eg. NUM, Equipment Officer" />}
                        {staffInputPage === 1 && <Input inputType="text" identifier="add-new" labelText="Hospital" />}
                        {staffInputPage === 1 && <Input inputType="text" identifier="add-new" labelText="Department" />}
                        {staffInputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />}
                        {staffInputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext="Enter dect phone number" />}
                        {staffInputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext="Enter mobile phone number" />}
                    </div>  
                    <img className="config-arrow config-right-arrow" onClick={(e) => updatePage(staffInputPage, setStaffInputPage, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="right-arrow"></img>          
                </div>
                <div className={"form-buttons-laptop"}>
                    <div className="update-button save-button">Save Changes</div>
                    <div className="update-button">Upload Updates</div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="modal-display">
                <div className="add-new-contact-input-container" ref={inputContainer}>
                    <Input inputType="text" identifier="add-new" labelText="Vendor Name" placeholdertext="Enter vendor for new contact" />
                    <Input inputType="text" identifier="add-new" labelText="New Contact Name" placeholdertext="Enter new contact name" />
                    <Input inputType="text" identifier="add-new" labelText="New Contact Position" placeholdertext="eg. Sales Rep, Clinical Specialist etc." />
                    <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />
                    <Input inputType="text" identifier="add-new" labelText="Email Address" placeholdertext="Enter email address" />
                </div>            
                <div className="update-button add-new-upload-button" onClick={() => uploadNewContact(inputContainer, formType)}>Upload Data</div>
            </div>
        );
    }
}