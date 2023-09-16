import { Input } from "./Input"

export function UpdateContact({currentContact, formType, page, pageData, queryClient, showMessage, closeDialog, closeUpdateContactModal}) {
    return (
        <div className="contact-update-display">
            <div className="contact-update-department-container">
                {formType === "staff" && <label>{currentContact.hospital}</label>}
                {formType === "vendor" && <label>{currentContact.vendor}</label>}
                {formType === "staff" && <label>{currentContact.department}</label>}
            </div>
            <div className="contact-update-input-container">
                <Input inputType="text" identifier="add-new" labelText="Current Contact Name" placeholdertext={currentContact.contact} />
                {currentContact.position !== "" && <Input inputType="text" identifier="add-new" labelText="Current Contact Position" placeholdertext={currentContact.position} />}
                <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext={currentContact.officePhone === "-" ? "" : currentContact.officePhone} />
                {formType === "staff" && <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext={currentContact.dectPhone === "-" ? "" : currentContact.dectPhone} />}
                <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext={currentContact.mobilePhone === "-" ? "" : currentContact.mobilePhone} />
                {formType === "vendor" && <Input inputType="text" identifier="add-new" labelText="Email Address" placeholdertext={currentContact.mobilePhone === "-" ? "" : currentContact.email} />}
            </div>
            <div className={"form-buttons-laptop"} style={formType === "staff" ? {transform: 'translateY(-10px)'} : currentContact.position !== "" ? {transform: 'translateY(-20px)'} : {transform: 'translateY(-40px)'}}>
                    <div className="update-button save-button">Save Changes</div>
                    <div className="update-button">Upload Updates</div>
            </div>
        </div>
    )
}