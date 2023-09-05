import { useRef } from "react"
import { Input } from "./Input";

// Regex for name, position, primary phone, dect, mobile phone, and vendor email
const inputsRegexArray = [/^[a-z ,.'-]+$/i, /^[a-z ]+$/i, /^[0-9]{10}$|^[1-9][0-9]{7}$/, /^[0-9]{5}$/, /^0[0-9]{9}$/g, /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/] 

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
    
    const inputContainer = useRef(null);

    return (
        <div className="modal-display">
            <div className="add-new-input-container" ref={inputContainer}>
                <Input inputType="text" identifier="add-new" labelText={formType === "staff" ? "Staff Contact Name" : "Vendor Contact Name"} placeholdertext={`Enter new contact name`} />
                <Input inputType="text" identifier="add-new" labelText={formType === "staff" ? "Staff Contact Position" : "Vendor Contact Position"} placeholdertext={formType === "staff" ? `eg. NUM, Equipment Officer` : `eg. Sales Rep, Clinical Specialist etc.`} />
                <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />
                {formType === "staff" && <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext="Enter dect phone number" />}
                <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext="Enter mobile phone number" />
                {formType === "vendor" && <Input inputType="text" identifier="add-new" labelText="Email Address" placeholdertext="Enter email address" />}
            </div>            
            <div className="update-button add-new-upload-button" onClick={() => uploadNewContact(inputContainer, formType)}>Upload Data</div>
        </div>
    );
}