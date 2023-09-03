import { Input } from "./Input";

export function AddNewContact({formType}) {
    
    return (
        <div className="modal-display">
            <div className="add-new-input-container">
                <Input inputType="text" identifier="add-new" labelText={formType === "staff" ? "Staff Contact Name" : "Vendor Contact Name"} placeholdertext={`Enter new contact name`} />
                <Input inputType="text" identifier="add-new" labelText={formType === "staff" ? "Staff Contact Position" : "Vendor Contact Position"} placeholdertext={formType === "staff" ? `eg. NUM, Equipment Officer` : `eg. Sales Rep, Clinical Specialist etc.`} />
                <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext="Enter office phone number" />
                {formType === "staff" && <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext="Enter dect phone number" />}
                <Input inputType="text" identifier="add-new" labelText="Mobile Phone" placeholdertext="Enter mobile phone number" />
                {formType === "vendor" && <Input inputType="text" identifier="add-new" labelText="Email Address" placeholdertext="Enter email address" />}
            </div>            
            <div className="update-button add-new-upload-button">Upload Data</div>
        </div>
    );
}