import { useState } from "react";
import { Input } from "./Input";
import { SelectInput } from "./SelectInput"

export function AddNewForm({page, pageData}) {
    
    const [addNewManufacturer, setAddNewManufacturer] = useState(false);
    const [addNewType, setaddNewType] = useState(false);

    const placeholderValue = page === "staff" ? "staff member full name" : "equipment model" 
    const nameInputLabel = page === "staff" ? "Full Name" : "Equipment Model/Name"

    function toggleAddNewType() {
        setaddNewType(t => !t);
    }
    
    function toggleAddNewManufacturer() {
        setAddNewManufacturer(m => !m);
    }

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
                <div className="edit-add-new-container">
                    <button onClick={toggleAddNewType} style={addNewType ? {backgroundColor: '#ff69b4'} : {backgroundColor: 'rgb(16, 172, 105)'}}>
                        <img className="add-new-edit-button" src={addNewType ? `http://localhost:5000/images/undo.svg` : `http://localhost:5000/images/edit.svg`} alt="edit"></img>
                    </button>
                    {addNewType ? <Input inputType="text" identifier="add-new" labelText="Device Type" placeholdertext={`Enter new device type`} /> : 
                    <SelectInput label="Device Type" optionData={currentTypes} />}
                    <div className="add-new-aligner"></div>
                </div>
                <div className="edit-add-new-container">
                    <button onClick={toggleAddNewManufacturer} style={addNewManufacturer ? {backgroundColor: '#ff69b4'} : {backgroundColor: 'rgb(16, 172, 105)'}}>
                        <img className="add-new-edit-button" src={addNewManufacturer ? `http://localhost:5000/images/undo.svg` : `http://localhost:5000/images/edit.svg`} alt="edit"></img>
                    </button>
                    {addNewManufacturer ? <Input inputType="text" identifier="add-new" labelText="Device Type" placeholdertext={`Enter new device type`} /> : 
                    <SelectInput label="Manufacturer" optionData={currentManufacturers} />}
                    <div className="add-new-aligner"></div>
                </div>
                <Input inputType="file" identifier="new-image" labelText="New Device Image" />
            </div>            
            <div className="update-button add-new-upload-button">Upload New Data</div>
        </div>
    );
}