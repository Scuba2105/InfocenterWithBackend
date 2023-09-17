import { Input } from "./Input"

export function UpdateContact({currentContact, formType, page, pageData, queryClient, showMessage, closeDialog, closeUpdateContactModal}) {
    return (
        <div className="contact-update-display">
            <div className="contact-update-department-container">
                {formType === "staff" && <label>{currentContact.hospital}</label>}
                {formType === "staff" && <label>{currentContact.department}</label>}
                {formType === "vendor" && <label>{currentContact.vendor}</label>}
            </div>
            <div className="contact-update-input-container">
                <Input inputType="text" identifier="add-new" type="update" labelText="Current Contact Name" defaultValue={currentContact.contact} />
                {currentContact.position !== "" && <Input inputType="text" identifier="add-new" type="update" labelText="Current Contact Position" defaultValue={currentContact.position} />}
                <Input inputType="text" identifier="add-new" labelText="Office Phone" type="update" defaultValue={currentContact.officePhone !== "" ? currentContact.officePhone : null} placeholdertext={currentContact.officePhone === "" ? "Enter Office Phone number" : null} />
                {formType === "staff" && <Input inputType="text" identifier="add-new" type="update" labelText="Dect Phone" defaultValue={currentContact.dectPhone !== "" ? currentContact.dectPhone : null} placeholdertext={currentContact.dectPhone === "" ? "Enter Dect Phone number" : null} />}
                <Input inputType="text" identifier="add-new" labelText="Mobile Phone" type="update" defaultValue={currentContact.mobilePhone !== "" ? currentContact.mobilePhone : null} placeholdertext={currentContact.mobilePhone === "" ? "Enter Mobile Phone number" : null} />
                {formType === "vendor" && <Input inputType="text" identifier="add-new" type="update" labelText="Email Address" defaultValue={currentContact.email !== "" ? currentContact.email : null} placeholdertext={currentContact.email === "" ? "Enter Email Address" : null} />}
            </div>
            <div className={"form-buttons-laptop"} style={formType === "staff" ? {transform: 'translateY(-10px)'} : currentContact.position !== "" ? {transform: 'translateY(-20px)'} : {transform: 'translateY(-40px)'}}>
                    <div className="update-button">Upload Updates</div>
            </div>
        </div>
    )
}