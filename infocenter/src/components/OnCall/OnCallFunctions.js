import { EditRosterIcon, ConfirmRosterIcon, MyRosterIcon, StaffRosterIcon, KeyContactsIcon, CheatsheetIcon } from "../../svg"
import { ModalSkeleton } from "../ModalSkeleton";
import { MyOnCall } from "./MyOnCall";
import { StaffRoster } from "./StaffRoster";
import { useState } from "react";
import { staffOnCallRoster, getAdjustedBeginRoster, beginDate } from '../../utils/utils';
import { EditRoster } from "./EditRoster";

// Define the labels and icons for mapping the buttons.
const functionsData = [{label: "Edit Roster", "icon": EditRosterIcon, color: "#6EDDC0"},
{label: "Confirm Roster", "icon": ConfirmRosterIcon, color: "#CBFF4D"},
{label: "My Roster", "icon": MyRosterIcon, color: "#CBFF4D"}, 
{label: "Staff Roster", "icon": StaffRosterIcon, color: "#6EDDC0"}, 
{label: "Key Contacts", "icon": KeyContactsIcon, color: "#6EDDC0"}, 
{label: "On-Call Cheatsheet", "icon": CheatsheetIcon, color: "#CBFF4D"}];

const modalLinkButtons = ["my-roster", "edit-roster", "staff-roster", "confirm-roster", "key-contacts", "on-call-cheatsheet"];

function showForm(setFormVisibile, setFormType, type) {
    if (modalLinkButtons.includes(type)) {
        setFormVisibile(true);
        setFormType(type);
    }
}

function hideForm(setFormVisibile) {
    setFormVisibile(false);
}

export function OnCallFunctions({queryClient, showMessage, closeDialog, page}) {

    const [formVisible, setFormVisibile] = useState(false);
    const [formType, setFormType] = useState(null);

    return (
        <div className="on-call-functions-container">
            <div className="on-call-functions-header flex-c">On-Call Utilities</div>
            {functionsData.map((entry, index) => {
                const type = entry.label.toLowerCase().replace(/\s/g, "-");
                const design = [0, 3, 4].includes(index) ? "main-link-button" : "alternate-link-button";
                return (
                    <div key={`${entry.label}-key`} className="on-call-function-container flex-c size-100">
                        <button className={`on-call-function-button flex-c ${type} ${design}`} onClick={() => showForm(setFormVisibile, setFormType, type)}>
                            <entry.icon color={entry.color} size="2.7vw"></entry.icon>
                            <div className="on-call-label-container flex-c">
                                <label className="on-call-label">{entry.label.split(" ")[0]}</label>
                                <label className="on-call-label">{entry.label.split(" ")[1]}</label>
                            </div>
                        </button>
                    </div>
                )
            })}
            {formVisible && 
            <ModalSkeleton type={formType} closeModal={() => hideForm(setFormVisibile)} page={page} >
                {formType === "my-roster" ? <MyOnCall></MyOnCall> :
                formType === "staff-roster" ? <StaffRoster></StaffRoster> :
                formType === "edit-roster" ? <EditRoster queryClient={queryClient} showMessage={showMessage} closeModal={() => hideForm(setFormVisibile)} closeDialog={closeDialog} page={page}></EditRoster> :
                <div className="modal-display">
                    <h2 className="on-call-form-placeholder">Yet to be implemented</h2>
                </div>}                
            </ModalSkeleton>}
        </div>
    )
}