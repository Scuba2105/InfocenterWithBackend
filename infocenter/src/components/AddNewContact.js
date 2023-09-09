import { useState, useRef } from "react"
import { Input } from "./Input";
import { SelectInput } from "./SelectInput";
import { serverConfig } from "../server";

// Regex for name, position, primary phone, dect, mobile phone, and vendor email
const inputsRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z &\/]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$|^[0-9]{5}$/, /^[0-9]{5}$/, /^0[0-9]{9}$/g, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/] 
const staffInputsDescriptions = ["Contact Name", "Contact Position", "Contact Hospital", "Contact Department", "Office Phone", "Dect Phone", "Mobile Phone"];
const vendorInputsDescriptions = ["Vendor", "Contact Name", "Contact Position", "Office Phone", "Mobile Phone", "Email"];

function saveNewStaffContact(inputContainer, newContactData, inputPage, queryClient, showMessage, closeDialog) {
    const textInputs = inputContainer.current.querySelectorAll("input");
    const selectInputs = inputContainer.current.querySelectorAll("select");
    const staffRegexArray = inputsRegexArray.slice(0, 5);
    const vendorRegexArray = inputsRegexArray.slice(0, 3).concat(inputsRegexArray.slice(4)); 
    
    // Specify the whether the new contact data is staff or vendor
    newContactData.current.contactType = "staff"

    // Validate text inputs with the appropriate regex, 
    for (let [index, input] of Array.from(textInputs).entries()) {
        if (inputPage === 1) {
            if (staffRegexArray[index].test(input.value) === false) {
                // Show warning message
                showMessage("warning", `The value entered for ${staffInputsDescriptions[index]} is not a valid entry`)
                return
            }
            else {
                newContactData.current[staffInputsDescriptions[index]] = input.value;
            }
        }
        else {
            if (input.value !== "") {
                console.log(input.value)
                if (staffRegexArray[index + 2].test(input.value) === false) {
                    // Show warning
                    showMessage("warning", `The value entered for ${staffInputsDescriptions[index + 4]} is not a valid entry`)
                    return
                }
                else {
                    newContactData.current[staffInputsDescriptions[index + 4]] = input.value;
                }
            }
        }
    }

    // Validate select inputs with appropriate regex
    if (inputPage === 1) {
        for (let [index, input] of Array.from(selectInputs).entries()) {
            if (staffRegexArray[1].test(input.value) === false) {
                // Show warning message
                showMessage("warning", `The value entered for ${staffInputsDescriptions[index + 2]} is not a valid entry`);
                return
            }
            else {
                newContactData.current[staffInputsDescriptions[index + 2]] = input.value;
            }
        }
    }
}

function uploadNewStaffData(newContactData, queryClient, showMessage, closeDialog) {
    // Check at least one phone number has been added.
    let phoneKeyCount = 0;
    for (let key of ["Office Phone", "Dect Phone", "Mobile Phone"]) {
        if (Object.keys(newContactData.current).includes(key))
        phoneKeyCount++
    }

    if (phoneKeyCount === 0) {
        // Show warning message
        showMessage("warning", "At least one phone number is required for upload.");
    }

    // Start uploading dialog and begin post request

}

function updatePage(inputPage, setinputPage, e) {
    if (e.currentTarget.classList.contains("config-left-arrow") && inputPage === 2) {
        setinputPage(1);
    }
    else if (e.currentTarget.classList.contains("config-right-arrow") && inputPage === 1) {
        setinputPage(2);
    }
}

function updateHospital(e, setHospital) {
    setHospital(e.currentTarget.value);
}

function updateDepartment(e, setDepartment) {
    setDepartment(e.currentTarget.value);
}

export function AddNewContact({formType, pageData, queryClient, showMessage, closeDialog}) {
    
    const [inputPage, setinputPage] = useState(1);
    const [hospital, setHospital] = useState("John Hunter Hospital");
    const newContactData = useRef({});
    const inputContainer = useRef(null);

    if (formType === "staff") {
        const hospitalSelectOptions = pageData.reduce((acc, entry) => {
            if (!acc.includes(entry.hospital)) {
                acc.push(entry.hospital);
            }
            return acc;
        }, []).sort();

        const departmentSelectOptions = pageData.filter((entry) => {
            return entry.hospital === hospital;
        }).reduce((acc, entry) => {
            if (!acc.includes(entry.department)) {
                acc.push(entry.department);
            }
            return acc; 
        }, []).sort()

        return (
            <div className="contact-modal-display">
                <div className="contact-indicator-container">
                    <div className={inputPage === 1 ? "indicator active-indicator" : "indicator"}></div>
                    <div className={inputPage === 2 ? "indicator active-indicator" : "indicator"}></div>
                </div>
                <div className="staff-contacts-input-container" style={inputPage === 2 ? {transform: 'translateY(31px)'} : null}>
                    <img className="config-arrow config-left-arrow" onClick={(e) => updatePage(inputPage, setinputPage, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="left-arrow"></img>
                    <div className="add-new-input-container" ref={inputContainer}>
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Name" placeholdertext={`Enter new contact name`} />}
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Position" placeholdertext="eg. NUM, Equipment Officer" />}
                        {inputPage === 1 && <SelectInput type="form-select-input" label="Hospital" value={hospital} optionData={hospitalSelectOptions} onChange={(e) => updateHospital(e, setHospital)}/>}
                        {inputPage === 1 && <SelectInput type="form-select-input" label="Department" defaultValue={departmentSelectOptions[0]} optionData={departmentSelectOptions} />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext="Enter dect phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext="Enter mobile phone number" />}
                    </div>  
                    <img className="config-arrow config-right-arrow" onClick={(e) => updatePage(inputPage, setinputPage, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="right-arrow"></img>          
                </div>
                <div className={"form-buttons-laptop"}>
                    <div className="update-button save-button" onClick={() => saveNewStaffContact(inputContainer, newContactData, inputPage, queryClient, showMessage, closeDialog)}>Save Changes</div>
                    <div className="update-button" onClick={() => uploadNewStaffData(newContactData, queryClient, showMessage, closeDialog)}>Upload Updates</div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="contact-modal-display">
                <div className="contact-indicator-container">
                    <div className={inputPage === 1 ? "indicator active-indicator" : "indicator"}></div>
                    <div className={inputPage === 2 ? "indicator active-indicator" : "indicator"}></div>
                </div>
                <div className="staff-contacts-input-container" style={{transform: 'translateY(30px)'}}>
                    <img className="config-arrow config-left-arrow" onClick={(e) => updatePage(inputPage, setinputPage, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="left-arrow"></img>
                    <div className="add-new-input-container" ref={inputContainer}>
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="Vendor" placeholdertext="Enter vendor for new contact" />}
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Name" placeholdertext="Enter new contact name" />}
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Position" placeholdertext="eg. Sales Rep, Clinical Specialist etc." />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext="Enter office phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Email Address" placeholdertext="Enter email address" />}
                    </div> 
                    <img className="config-arrow config-right-arrow" onClick={(e) => updatePage(inputPage, setinputPage, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="right-arrow"></img>          
                </div>
                <div className={"form-buttons-laptop"}>
                    <div className="update-button save-button" onClick={() => saveNewStaffContact(inputContainer, inputPage)}>Save Changes</div>
                    <div className="update-button">Upload Updates</div>
                </div>
            </div>
        );
    }
}