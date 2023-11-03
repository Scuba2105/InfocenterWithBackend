import { EditRosterIcon, ConfirmRosterIcon, MyRosterIcon, StaffRosterIcon, KeyContactsIcon, CheatsheetIcon } from "../../svg"
import { ModalSkeleton } from "../ModalSkeleton";
import { MyOnCall } from "./MyOnCall";
import { StaffRoster } from "./StaffRoster";
import { useState } from "react";
import { EditRoster } from "./EditRoster";
import { ConfirmRoster } from "./ConfirmRoster";
import { serverConfig } from "../../server";

// Define the labels and icons for mapping the buttons.
const functionsData = [{label: "Edit Roster", "icon": EditRosterIcon, color: "#5ef8ed"},
{label: "Confirm Roster", "icon": ConfirmRosterIcon, color: "#BCE7FD"},
{label: "My Roster", "icon": MyRosterIcon, color: "#BCE7FD"}, 
{label: "Staff Roster", "icon": StaffRosterIcon, color: "#5ef8ed"}, 
{label: "Key Contacts", "icon": KeyContactsIcon, color: "#5ef8ed", "href": `https://${serverConfig.host}:${serverConfig.port}/oncall/oncall-key-contacts.docx`}, 
{label: "On-Call Cheatsheet", "icon": CheatsheetIcon, color: "#BCE7FD", "href": `https://${serverConfig.host}:${serverConfig.port}/oncall/oncall-cheatsheet.docx`}];

const modalLinkButtons = ["my-roster", "edit-roster", "staff-roster", "confirm-roster"];

function showForm(setFormVisibile, setFormType, type) {
    // If modal form required on button push then make the form visible 
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
                if (modalLinkButtons.includes(type)) {
                    return (
                        <div key={`${entry.label}-key`} className="on-call-function-container flex-c size-100">
                            <button className={`on-call-function-button flex-c-col ${type} ${design}`} onClick={() => showForm(setFormVisibile, setFormType, type)}>
                                <entry.icon color={entry.color} size="2.7vw"></entry.icon>
                                <div className="on-call-label-container flex-c-col">
                                    <label className="on-call-label">{entry.label.split(" ")[0]}</label>
                                    <label className="on-call-label">{entry.label.split(" ")[1]}</label>
                                </div>
                            </button>
                        </div>
                    )
                }
                else {
                    return (
                        <div key={`${entry.label}-key`} className="on-call-function-container flex-c size-100">
                            <a className={`on-call-function-button flex-c-col ${type} ${design}`} >
                                <entry.icon color={entry.color} size="2.7vw"></entry.icon>
                                <div className="on-call-label-container flex-c-col">
                                    <label className="on-call-label">{entry.label.split(" ")[0]}</label>
                                    <label className="on-call-label">{entry.label.split(" ")[1]}</label>
                                </div>
                            </a>
                        </div>
                    )
                }                
            })}
            {formVisible && 
            <ModalSkeleton type={formType} closeModal={() => hideForm(setFormVisibile)} page={page} >
                {formType === "my-roster" ? <MyOnCall></MyOnCall> :
                formType === "staff-roster" ? <StaffRoster></StaffRoster> :
                formType === "edit-roster" ? <EditRoster queryClient={queryClient} showMessage={showMessage} closeModal={() => hideForm(setFormVisibile)} closeDialog={closeDialog} page={page}></EditRoster> :
                <ConfirmRoster queryClient={queryClient} showMessage={showMessage} closeModal={() => hideForm(setFormVisibile)} closeDialog={closeDialog} page={page}></ConfirmRoster>}                
            </ModalSkeleton>}
        </div>
    )
}