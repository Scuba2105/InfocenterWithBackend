import { EditRosterIcon, ConfirmRosterIcon, MyRosterIcon, StaffRosterIcon, KeyContactsIcon, CheatsheetIcon } from "../svg"
import { ModalSkeleton } from "./ModalSkeleton";
import { useState } from "react";

// Define the labels and icons for mapping the buttons.
const functionsData = [{label: "Edit Roster", "icon": EditRosterIcon, color: "#036d4d"},
{label: "Confirm Roster", "icon": ConfirmRosterIcon, color: "#D59406"},
{label: "My On-Call", "icon": MyRosterIcon, color: "#7E0320"}, 
{label: "Staff Roster", "icon": StaffRosterIcon, color: "#C34003"}, 
{label: "Key Contacts", "icon": KeyContactsIcon, color: "#022A7A"}, 
{label: "On-Call Cheatsheet", "icon": CheatsheetIcon, color: "#5E0275"}];

const staffOnCallRoster = ["Durga Sompalle", "Mitchell Pyne", "Atif Siddiqui",
"Mitchell Pacey", "Steven Bradbury", "Ray Aunei Mose", "Rodney Birt", "Kendo Wu", "Matthew Murrell"];

const modalLinkButtons = ["my-on-call", "edit-roster", "staff-roster", "confirm-roster"]

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
            {functionsData.map((entry) => {
                const type = entry.label.toLowerCase().replace(/\s/g, "-");
                return (
                    <div key={`${entry.label}-key`} className="on-call-function-container flex-c size-100">
                        <button className={`on-call-function-button flex-c ${type}`} onClick={() => showForm(setFormVisibile, setFormType, type)}>
                            <entry.icon color={entry.color} size="2.7vw"></entry.icon>
                            <div className="on-call-label-container flex-c">
                                <label className="on-call-label">{entry.label.split(" ")[0]}</label>
                                <label className="on-call-label">{entry.label.split(" ")[1]}</label>
                            </div>
                        </button>
                    </div>
                )
            })}
            {formVisible && <ModalSkeleton type={formType} closeModal={() => hideForm(setFormVisibile)} page={page} ></ModalSkeleton>}
        </div>
    )
}