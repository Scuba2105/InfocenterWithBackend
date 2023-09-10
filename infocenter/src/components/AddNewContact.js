import { useState, useRef } from "react"
import { Input } from "./Input";
import { SelectInput } from "./SelectInput";
import { TooltipButton } from "./TooltipButton";
import { serverConfig } from "../server";

// Regex for name, position, primary phone, dect, mobile phone, and vendor email
const inputsRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z &\/]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$|^[0-9]{5}$/, /^[0-9]{5}$/, /^0[0-9]{9}$/g, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/] 
const staffInputsDescriptions = ["Contact Name", "Contact Position", "Hospital", "Department", "Office Phone", "Dect Phone", "Mobile Phone"];
const vendorInputsDescriptions = ["Vendor", "Contact Name", "Contact Position", "Office Phone", "Mobile Phone", "Email"];

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

function saveNewStaffContact(inputContainer, newContactData, inputPage, addNewHospital, addNewDepartment, queryClient, showMessage, closeDialog) {
    const textInputs = inputContainer.current.querySelectorAll("input");
    const selectInputs = inputContainer.current.querySelectorAll("select");
    const staffRegexArray = inputsRegexArray.slice(0, 5);
    const vendorRegexArray = inputsRegexArray.slice(0, 3).concat(inputsRegexArray.slice(4)); 
    
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
            console.log(input.value)
            const descIndex = getDescriptionIndex(index, addNewHospital, addNewDepartment)
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

async function uploadNewStaffData(newContactData, queryClient, showMessage, closeDialog, formType) {
    for (let key of ["Contact Name", "Contact Position", "Hospital", "Department"]) {
        if (!Object.keys(newContactData.current).includes(key)) {
            showMessage("warning", `The ${key} data is empty. Please complete this field and try again.`);
            return
        }
    }

    // Check at least one phone number has been added.
    let phoneKeyCount = 0;
    for (let key of ["Office Phone", "Dect Phone", "Mobile Phone"]) {
        if (Object.keys(newContactData.current).includes(key))
        phoneKeyCount++
    }

    if (phoneKeyCount === 0) {
        // Show warning message
        showMessage("warning", "At least one phone number is required for upload.");
        return
    }

    // Start uploading dialog and begin post request
    showMessage("uploading", `Uploading New Contact Data`);

    // Start the post request
    try {
        // Post the data to the server  
        const res = await fetch(`http://${serverConfig.host}:${serverConfig.port}/AddNewContact/${formType}`, {
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

function toggleNewDepartment(setAddNewHospital, setAddNewDepartment) {
    setAddNewDepartment(d => !d)
}

export function AddNewContact({formType, page, pageData, queryClient, showMessage, closeDialog}) {
    
    const [inputPage, setinputPage] = useState(1);
    const [hospital, setHospital] = useState("Belmont Hospital");
    const [addNewHospital, setAddNewHospital] = useState(false);
    const [addNewDepartment, setAddNewDepartment] = useState(false);
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
                    <img className="config-arrow config-left-arrow" style={inputPage === 1 ? {transform: 'translateX(40px)'} : null} onClick={(e) => updatePage(inputPage, setinputPage, setAddNewHospital, setAddNewDepartment, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="left-arrow"></img>
                    <div className="add-new-input-container" ref={inputContainer}>
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Name" placeholdertext={`Enter new contact name`} />}
                        {inputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Position" placeholdertext="eg. NUM, Equipment Officer" />}
                        {inputPage === 1 && 
                        <div className="edit-add-new-container">
                            <TooltipButton identifier="manufacturer" content={addNewHospital ? "Undo" :"Add New"} boolean={addNewHospital} setAddNewHospital={setAddNewHospital} toggleFunction={() => toggleNewHospital(addNewHospital, setAddNewHospital, setAddNewDepartment)}/>
                            {addNewHospital ? <Input inputType="text" identifier="add-new" labelText="Hospital" placeholdertext={`Enter new contact Hospital`} /> : 
                            <SelectInput type="form-select-input" label="Hospital" value={hospitalSelectOptions.find(entry=> entry.hospital === hospital)} optionData={hospitalSelectOptions} onChange={(e) => updateHospital(e, setHospital, pageData, inputContainer)}/>}
                            <div className="add-new-aligner"></div>
                        </div>}
                        {inputPage === 1 &&
                        <div className="edit-add-new-container">
                            {!addNewDepartment && <TooltipButton identifier="manufacturer" content={addNewDepartment ? "Undo" :"Add New"} boolean={addNewHospital} setAddNewDepartment={setAddNewDepartment} toggleFunction={() => toggleNewDepartment(setAddNewHospital, setAddNewDepartment)}/>}
                            {addNewDepartment ? <Input inputType="text" identifier="add-new" labelText="Department" placeholdertext={`Enter new contact Department`} /> : 
                            <SelectInput type="form-select-input" label="Department" value={hospital} optionData={departmentSelectOptions} onChange={(e) => updateHospital(e, setHospital, pageData, inputContainer)}/>}
                            {!addNewDepartment && <div className="add-new-aligner"></div>}
                        </div>}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext="Enter dect phone number" />}
                        {inputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext="Enter mobile phone number" />}
                    </div>  
                    <img className="config-arrow config-right-arrow" style={inputPage === 1 ? {transform: 'translate(-60px, 0px) rotate(180deg)'} : null} onClick={(e) => updatePage(inputPage, setinputPage, setAddNewHospital, setAddNewDepartment, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="right-arrow"></img>          
                </div>
                <div className={"form-buttons-laptop"}>
                    <div className="update-button save-button" onClick={() => saveNewStaffContact(inputContainer, newContactData, inputPage, addNewHospital, addNewDepartment, queryClient, showMessage, closeDialog)}>Save Changes</div>
                    <div className="update-button" onClick={() => uploadNewStaffData(newContactData, queryClient, showMessage, closeDialog, formType)}>Upload Updates</div>
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