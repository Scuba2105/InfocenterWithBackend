import { Input } from "./Input";
import { SelectInput } from "./SelectInput"

export function AddNewForm({page, pageData}) {
    // need img, model, type, manufacturer, 
    const placeholderValue = page === "staff" ? "staff member full name" : "equipment model" 
    const nameInputLabel = page === "staff" ? "Full Name" : "Equipment Model/Name"

    function generateExistingSelectValues() {
        const values = pageData.reduce((acc, currEntry) => {
            if (!acc.models.includes(currEntry.model)) {
                acc.models.push(currEntry.model);
            }
            if (!acc.types.includes(currEntry.type)) {
                acc.types.push(currEntry.type);
            }
            if (!acc.manufacturers.includes(currEntry.manufacturer)) {
                acc.manufacturers.push(currEntry.manufacturer);
            }
            return acc;
        }, {models: [], types: [], manufacturers: []});
        return values;
    }

    // Generate existing values for data validation and consistency. 
    const existingSelectValues = generateExistingSelectValues();
    const unavailableModels = existingSelectValues.models;
    const currentTypes = existingSelectValues.types.sort();
    const currentManufacturers = existingSelectValues.manufacturers.sort(); 

    return (
        <div className="modal-display">
            <h3 className="add-new-heading" >New Equipment Details</h3>
            <div className="add-new-input-container">
                <Input inputType="text" identifier="add-new" labelText={nameInputLabel} placeholdertext={`Enter new ${placeholderValue}`} />
                <SelectInput label="Device Type" optionData={currentTypes} />
                <SelectInput label="Manufacturer" optionData={currentManufacturers} />
                <Input inputType="file" identifier="new-image" labelText="New Device Image" />
            </div>            
            <div className="update-button add-new-upload-button">Upload New Data</div>
        </div>
    );
}