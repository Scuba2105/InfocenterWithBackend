import { useState, useRef } from "react"
import { Input } from "./Input";
import { SelectInput } from "./SelectInput";
import { serverConfig } from "../server";

// Regex for name, position, primary phone, dect, mobile phone, and vendor email
const inputsRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z ]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$/, /^[0-9]{5}$/, /^0[0-9]{9}$/g, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/] 

function saveNewStaffContact(inputContainer, staffInputPage) {
    const inputs = inputContainer.current.querySelectorAll("input");
    const selectInputs = inputContainer.current.querySelectorAll("select");
    const staffRegexArray = inputsRegexArray.slice(0, 5);
    const vendorRegexArray = inputsRegexArray.slice(0, 3).concat(inputsRegexArray.slice(4)); 
    
    // Validate text inputs
    inputs.forEach((input, index) => {
        if (staffInputPage === 1) {
            console.log(staffRegexArray[index].test(input.value), staffRegexArray[index]);
        }
        else {
            console.log(staffRegexArray[index + 2].test(input.value), staffRegexArray[index]);
        }
    })

    // Validate select inputs
    selectInputs.forEach((input, index) => {
        console.log(staffRegexArray[1].test(input.value), staffRegexArray[index]);
    })
}

function updatePage(staffInputPage, setStaffInputPage, e) {
    if (e.currentTarget.classList.contains("config-left-arrow") && staffInputPage === 2) {
        setStaffInputPage(1);
    }
    else if (e.currentTarget.classList.contains("config-right-arrow") && staffInputPage === 1) {
        setStaffInputPage(2);
    }
}

function updateHospital(e, setHospital) {
    setHospital(e.currentTarget.value);
}

function updateDepartment(e, setDepartment) {
    setDepartment(e.currentTarget.value);
}

export function AddNewContact({formType, pageData}) {
    
    const [staffInputPage, setStaffInputPage] = useState(1);
    const [hospital, setHospital] = useState("John Hunter Hospital")
    const [department, setDepartment] = useState(null);
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
                    <div className={staffInputPage === 1 ? "indicator active-indicator" : "indicator"}></div>
                    <div className={staffInputPage === 2 ? "indicator active-indicator" : "indicator"}></div>
                </div>
                <div className="staff-contacts-input-container" style={staffInputPage === 2 ? {transform: 'translateY(31px)'} : null}>
                    <img className="config-arrow config-left-arrow" onClick={(e) => updatePage(staffInputPage, setStaffInputPage, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="left-arrow"></img>
                    <div className="add-new-input-container" ref={inputContainer}>
                        {staffInputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Name" placeholdertext={`Enter new contact name`} />}
                        {staffInputPage === 1 && <Input inputType="text" identifier="add-new" labelText="New Contact Position" placeholdertext="eg. NUM, Equipment Officer" />}
                        {staffInputPage === 1 && <SelectInput label="Contact Hospital" value={hospital} optionData={hospitalSelectOptions} onChange={(e) => updateHospital(e, setHospital)}/>}
                        {staffInputPage === 1 && <SelectInput label="Contact Department" defaultValue={departmentSelectOptions[0]} optionData={departmentSelectOptions} onChange={(e) => updateDepartment(e, setDepartment)}/>}
                        {staffInputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />}
                        {staffInputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext="Enter dect phone number" />}
                        {staffInputPage === 2 && <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext="Enter mobile phone number" />}
                    </div>  
                    <img className="config-arrow config-right-arrow" onClick={(e) => updatePage(staffInputPage, setStaffInputPage, e)} src={`http://${serverConfig.host}:${serverConfig.port}/images/left-arrow.jpg`} alt="right-arrow"></img>          
                </div>
                <div className={"form-buttons-laptop"}>
                    <div className="update-button save-button" onClick={() => saveNewStaffContact(inputContainer, staffInputPage)}>Save Changes</div>
                    <div className="update-button">Upload Updates</div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="modal-display">
                <div className="add-new-contact-input-container" ref={inputContainer}>
                    <Input inputType="text" identifier="add-new" labelText="Vendor" placeholdertext="Enter vendor for new contact" />
                    <Input inputType="text" identifier="add-new" labelText="New Contact Name" placeholdertext="Enter new contact name" />
                    <Input inputType="text" identifier="add-new" labelText="New Contact Position" placeholdertext="eg. Sales Rep, Clinical Specialist etc." />
                    <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />
                    <Input inputType="text" identifier="add-new" labelText="Email Address" placeholdertext="Enter email address" />
                </div>            
                <div className="update-button add-new-upload-button">Upload Data</div>
            </div>
        );
    }
}