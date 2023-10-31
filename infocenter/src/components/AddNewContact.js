import { useState, useRef, useEffect } from "react"
import { Input } from "./Input";
import { SelectInput } from "./SelectInput";
import { TooltipButton } from "./TooltipButton";
import { serverConfig } from "../server";
import { NavigationArrow } from "../svg";

// Regex for name, position, primary phone, dect, mobile phone, and vendor email
const staffInputsRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z0-9 &/]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$|^[0-9]{5}$/, /^[0-9]{5}$/, /^0[0-9]{9}$/, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/] 
const vendorRegexArray = [/^[a-z ,.'-3]+$/i, /^[a-z ,.'-]+$/i, /^[a-z ,.'-/]+$|^\s*$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$/, /^0[0-9]{9}$/, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/];
const staffInputsDescriptions = ["Contact Name", "Contact Position", "Hospital", "Department", "Office Phone", "Dect Phone", "Mobile Phone"];
const vendorInputsDescriptions = ["Vendor", "Contact Name", "Contact Position", "Office Phone", "Mobile Phone", "Email"];

const genericVendorNames = ["Customer Service", "Service Department", "Technical Service"];

function getInputs(inputContainer, inputPage, addNewVendor) {
    if (inputPage === 1 && !addNewVendor) {
        const selectInput = inputContainer.querySelector("select");
        const textInputs = inputContainer.querySelectorAll("input");
        return [selectInput, textInputs[0], textInputs[1]];
    }
    else {
        const textInputs = inputContainer.querySelectorAll("input");
        return Array.from(textInputs);
    }
}

function getDescriptionIndex(index, addNewHospital, addNewDepartment) {
    if (!addNewHospital && !addNewDepartment) {
        return index + 2;
    }
    else if (!addNewHospital && addNewDepartment) {
        return index + 1;
    }
    else {
        return 0;
    }
}

function saveNewVendorContact(inputContainer, newContactData, inputPage, addNewVendor, showMessage, closeDialog) {
    
    const inputElements = getInputs(inputContainer.current, inputPage, addNewVendor)
    
    // Validate the provided input values.
    for (let [index, input] of inputElements.entries()) {
        
        // Get index based on whether page 1 or page 2.
        const regexIndex = index + (inputPage - 1)*3;
        
        // Validate the inputs for each page and show warning if fails validation. Else, add entry to contact data.
        if ((inputPage === 1) || (input.value !== "" && inputPage === 2)) {
            if (!vendorRegexArray[regexIndex].test(input.value)) {
                showMessage("warning", `The input value for ${vendorInputsDescriptions[regexIndex]} is not valid. Please provide a valid input and try again.`)
                return
            }
            else {
                newContactData.current[vendorInputsDescriptions[regexIndex]] = input.value
            }
        }
    }
    
    const vendorNumbers = vendorInputsDescriptions.slice(3)
    let inputCount = 0;
    for (let [index, value] of vendorNumbers.entries()) {
        if (newContactData.current[value] === "") {
            inputCount++
        }
    }
    
    if (inputCount > 0) {
        showMessage("warning", "Contact details are incomplete. Please enter at least one phone number or email address.")
        return
    }
    
    let message;
    if (inputPage === 1) {
        message = "Vendor, Name, and Position, data for new contact has been saved ready for upload." 
    }
    else {
        message = "Phone number/s and/or email data for new contact has been saved ready for upload."
    }
    showMessage("info", message)
    setTimeout(() => {
        closeDialog()
    }, 1600);
}

function saveNewStaffContact(inputContainer, newContactData, inputPage, addNewHospital, addNewDepartment, queryClient, showMessage, closeDialog) {
    const textInputs = inputContainer.current.querySelectorAll("input");
    const selectInputs = inputContainer.current.querySelectorAll("select");
    const staffRegexArray = staffInputsRegexArray.slice(0, 5);
        
    // Specify the whether the new contact data is staff or vendor
    newContactData.current.contactType = "staff"

    // Validate text inputs with the appropriate regex, 
    for (let [index, input] of Array.from(textInputs).entries()) {
        if (inputPage === 1) {
            const regexIndex = index <= 1 ? index : 1;
            const descIndex = !addNewHospital && addNewDepartment && index >= 2 ? index + 1 : index
            if (staffRegexArray[regexIndex].test(input.value) === false) {
                showMessage("warning", `The value entered for ${staffInputsDescriptions[descIndex]} is not a valid entry`)
                return
            }
            else {
                newContactData.current[staffInputsDescriptions[descIndex]] = input.value;
            }
        }
        else {
            if (input.value !== "") {
                if (staffRegexArray[index + 2].test(input.value) === false) {
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
            const descIndex = getDescriptionIndex(index, addNewHospital, addNewDepartment)
            console.log(staffRegexArray[1], input.value)
            if (staffRegexArray[1].test(input.value) === false) {
                showMessage("warning", `The value entered for ${staffInputsDescriptions[descIndex]} is not a valid entry`);
                return
            }
            else {
                newContactData.current[staffInputsDescriptions[descIndex]] = input.value;
            }
        }
    }
    
    let message;
    if (inputPage === 1) {
        message = "Name, Position, Hospital and Department data for new contact has been saved ready for upload." 
    }
    else {
        message = "Phone numbers data for new contact has been saved ready for upload."
    }
    showMessage("info", message)
    setTimeout(() => {
        closeDialog()
    }, 1600);
}

async function uploadNewContactData(newContactData, queryClient, showMessage, closeDialog, formType, closeAddContactModal) {
    
    if (formType === "staff") {
        if (Object.keys(newContactData.current).length < 5) {
            showMessage("warning", "Contact data is incomplete. You must complete Name, Position, Hospital and Deprtment then also enter at least one Contact Number. Please update the contact details and try again.")
            return
        }
    }
    else {
        // Check the saved contact data meets minimum requirements.
        if (Object.keys(newContactData.current).length < 4) {
            showMessage("warning", "Contact data is incomplete. You must complete Vendor, Name and Position then also enter at least one Contact Number or Email Address. Please update the contact details and try again.")
            return
        }
    }

    // Add the date string to the update data to track when it was added.
    const currentDate = new Date();
    newContactData.current["Current Date"] = currentDate.toLocaleDateString();

    console.log(newContactData.current);
    // Start uploading dialog and begin post request
    showMessage("uploading", `Uploading New Contact Data`);

    // Start the post request
    try {
        // Post the data to the server  
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/AddNewContact/${formType}`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newContactData.current),
        });

        const data = await res.json()
        
        if (data.type === "Error") {
            closeDialog();
            showMessage("error", `${data.message}. If the issue persists please contact an administrator.`);
        }
        else {                            
            // Need to update app data.
            queryClient.invalidateQueries('dataSource');

            closeDialog();
            showMessage("info", 'Resources have been successfully updated!');
            setTimeout(() => {
                closeDialog();
                closeAddContactModal();
            }, 1600);
        }

    } catch (error) {
        showMessage("error", `${error.message}.`)
    }
}

function updatePage(inputPage, setinputPage, setAddNewHospital, setAddNewDepartment, e) {
    if (e.currentTarget.classList.contains("config-left-arrow") && inputPage === 2) {
        setinputPage(1);
        setAddNewHospital(false);
        setAddNewDepartment(false);
    }
    else if (e.currentTarget.classList.contains("config-right-arrow") && inputPage === 1) {
        setinputPage(2);
    }
}

// Update hospital and department select inputs
function updateHospital(e, setHospital, pageData, inputContainer) {
    const selectedHospital = e.currentTarget.value;
    const departmentSelectInput = inputContainer.current.querySelectorAll("select")[1];
    const initialDepartment = pageData.filter((entry) => {
        return entry.hospital === selectedHospital;
    }).map(entry => entry.department).sort()[0];
    setHospital(selectedHospital);
    departmentSelectInput.value = (initialDepartment);
}

function toggleNewHospital(addNewHospital, setAddNewHospital, setAddNewDepartment) {
    const departToggleVisible = addNewHospital === true ? false : true;
    setAddNewHospital(h => !h)
    setAddNewDepartment(departToggleVisible);
}

function toggleNewDepartment(setAddNewDepartment) {
    setAddNewDepartment(d => !d)
}

function toggleNewVendor(setAddNewVendor) {
    setAddNewVendor(d => !d)
}

export function AddNewContact({formType, page, pageData, queryClient, showMessage, closeDialog, closeAddContactModal}) {
    
    const [inputPage, setinputPage] = useState(1);
    const [hospital, setHospital] = useState("John Hunter Hospital");
    const [addNewHospital, setAddNewHospital] = useState(false);
    const [addNewDepartment, setAddNewDepartment] = useState(false);
    const [addNewVendor, setAddNewVendor] = useState(false);
    const newContactData = useRef({});
    const inputContainer = useRef(null);

    useEffect(() => {
        if (formType === "staff" && inputPage === 1 && !addNewHospital) {
            const hospitalSelect = inputContainer.current.querySelectorAll("select")[0];
            hospitalSelect.value = hospital;
        }
    }, [addNewHospital, formType, hospital, inputPage]);
    
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
            <div className="contact-modal-display flex-c-col">
                <div className="contact-indicator-container flex-c">
                    <div className={inputPage === 1 ? "indicator active-indicator" : "indicator"}></div>
                    <div className={inputPage === 2 ? "indicator active-indicator" : "indicator"}></div>
                </div>
                <div className="staff-contacts-input-container flex-c" style={inputPage === 2 ? {transform: 'translateY(31px)'} : null}>
                    <NavigationArrow color="white" size="45px" identifier={inputPage === 1 ? "config-left-arrow config-left-arrow1" : "config-left-arrow config-left-arrow2"} onClick={(e) => updatePage(inputPage, setinputPage, setAddNewHospital, setAddNewDepartment, e)} />
                    <div className="add-new-input-container" ref={inputContainer}>
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Name" placeholdertext={`Enter new contact name`} />}
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Position" placeholdertext="eg. NUM, Equipment Officer" />}
                        {inputPage === 1 && 
                        <div className="edit-add-new-container">
                            <TooltipButton content={addNewHospital ? "Undo" :"Add New"} boolean={addNewHospital} toggleFunction={() => toggleNewHospital(addNewHospital, setAddNewHospital, setAddNewDepartment)}/>
                            {addNewHospital ? <Input inputType="text" identifier="add-new" labelText="Hospital" placeholdertext={`Enter new contact Hospital`} /> : 
                            <SelectInput type="form-select-input" label="Hospital" value={hospital} optionData={hospitalSelectOptions} onChange={(e) => updateHospital(e, setHospital, pageData, inputContainer)}/>}
                            <div className="add-new-aligner"></div>
                        </div>}
                        {inputPage === 1 &&
                        <div className="edit-add-new-container">
                            {!addNewDepartment && <TooltipButton content={addNewDepartment ? "Undo" :"Add New"} boolean={addNewHospital} toggleFunction={() => toggleNewDepartment(setAddNewDepartment)}/>}
                            {addNewDepartment ? <Input inputType="text" identifier="add-new" labelText="Department" placeholdertext={`Enter new contact Department`} /> : 
                            <SelectInput type="form-select-input" label="Department" optionData={departmentSelectOptions} />}
                            {!addNewDepartment && <div className="add-new-aligner"></div>}
                        </div>}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext="Enter dect phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext="Enter mobile phone number" />}
                    </div>  
                    <NavigationArrow color="white" size="45px" identifier={inputPage === 1 ? "config-right-arrow config-right-arrow1" : "config-right-arrow config-right-arrow2"} onClick={(e) => updatePage(inputPage, setinputPage, setAddNewHospital, setAddNewDepartment, e)} />          
                </div>
                <div className="form-buttons" style={inputPage === 1 ? {marginTop: 40 + 'px'} : {marginTop: 60 + 'px'}}>
                    <div className="update-button save-button" onClick={() => saveNewStaffContact(inputContainer, newContactData, inputPage, addNewHospital, addNewDepartment, queryClient, showMessage, closeDialog)}>Save Changes</div>
                    <div className="update-button" onClick={() => uploadNewContactData(newContactData, queryClient, showMessage, closeDialog, formType, closeAddContactModal)}>Upload Updates</div>
                </div>
            </div>
        );
    }
    else {

        const vendorSelectOptions = pageData.reduce((acc, entry) => {
            if (!acc.includes(entry.vendor)) {
                acc.push(entry.vendor);
            }
            return acc;
        }, []).sort();
        return (
            <div className="contact-modal-display flex-c-col">
                <div className="contact-indicator-container flex-c">
                    <div className={inputPage === 1 ? "indicator active-indicator" : "indicator"}></div>
                    <div className={inputPage === 2 ? "indicator active-indicator" : "indicator"}></div>
                </div>
                <div className="staff-contacts-input-container flex-c" style={{transform: 'translateY(30px)'}}>
                    <NavigationArrow color="white" size="45px" identifier={inputPage === 1 ? "config-left-arrow config-left-arrow1" : "config-left-arrow config-left-arrow2"} onClick={(e) => updatePage(inputPage, setinputPage, setAddNewHospital, setAddNewDepartment, e)} />
                    <div className="add-new-input-container" ref={inputContainer}>
                        {inputPage === 1 &&
                        <div className="edit-add-new-container flex-c">
                            {<TooltipButton content={addNewVendor ? "Undo" :"Add New"} boolean={addNewVendor} toggleFunction={() => toggleNewVendor(setAddNewVendor)}/>}
                            {addNewVendor ? <Input inputType="text" identifier="add-new" labelText="Vendor" placeholdertext="Enter vendor for new contact" /> : 
                            <SelectInput type="form-select-input" label="Vendor" optionData={vendorSelectOptions} />}
                            {<div className="add-new-aligner"></div>}
                        </div>}
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Name" placeholdertext="Enter new contact name" />}
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Position" placeholdertext="eg. Sales Rep, Clinical Specialist etc." />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext="Enter office phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Email Address" placeholdertext="Enter email address" />}
                    </div> 
                    <NavigationArrow color="white" size="45px" identifier={inputPage === 1 ? "config-right-arrow config-right-arrow1" : "config-right-arrow config-right-arrow2"} onClick={(e) => updatePage(inputPage, setinputPage, setAddNewHospital, setAddNewDepartment, e)} />          
                </div>
                <div className="form-buttons" style={{marginTop: 60 + 'px'}}>
                    <div className="update-button save-button" onClick={() => saveNewVendorContact(inputContainer, newContactData, inputPage, addNewVendor, showMessage, closeDialog)}>Save Changes</div>
                    <div className="update-button" onClick={() => uploadNewContactData(newContactData, queryClient, showMessage, closeDialog, formType, closeAddContactModal)}>Upload Updates</div>
                </div>
            </div>
        );
    }
}