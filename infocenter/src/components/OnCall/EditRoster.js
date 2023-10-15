import { Input } from "../Input";
import { SelectInput } from "../SelectInput";
import { staffOnCallRoster } from "../../utils/utils";

export function EditRoster() {
    return (
        <div className="modal-display">
            <form className="edit-roster-form">
                <SelectInput type="form-select-input" optionData={staffOnCallRoster} label="Staff Member" ></SelectInput>
                <Input inputType="date" identifier="date-change" labelText={"Start Date"}></Input>
                <Input inputType="date" identifier="date-change" labelText={"End Date"}></Input>
                <Input inputType="text" identifier="date-change" labelText={"Comments"}></Input>
                <div className="update-button edit-roster-update-btn">Upload Data</div>
            </form>
        </div>
    )
}