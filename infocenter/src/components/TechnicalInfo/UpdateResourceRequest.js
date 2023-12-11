import { SelectInput } from "../SelectInput";
import { Input } from "../Input";

const updateOptions = ["Service Manual", "User Manual", "Configurations", "Software", "Other Documents", "Passwords"]

export function UpdateResourceRequest({selectedData}) {
    
    return (
        <div className="modal-display"> 
            <div className="request-form-instruction flex-c-col">
                <h3>Request Form Purpose</h3>
                <span>{`Unable to locate a particular resource for the ${selectedData.model} ${selectedData.type}?`}</span>
                <span>Complete this form to submit an update request. An Information Centre Administrator will then consider your request and update upon approval.</span>
            </div>
            <SelectInput type="form-select-input" label="Resource Type" optionData={updateOptions}/>
        </div>
    )
}