import { EditRosterIcon, ConfirmRosterIcon, MyRosterIcon, StaffRosterIcon, 
    CheatsheetIcon, AuthorisationIcon, PadlockIcon } from "../../svg"
import { ModalSkeleton } from "../ModalSkeleton";
import { MyOnCall } from "./MyOnCall";
import { StaffRoster } from "./StaffRoster";
import { useState } from "react";
import { EditRoster } from "./EditRoster";
import { ConfirmRoster } from "./ConfirmRoster";
import { serverConfig } from "../../server";
import { useUser } from "../StateStore";

// On-Call Administrators
const onCallAdministrators = ["Paul Cookson", "Durga Sompalle", "Atif Siddiqui"];

// Define the labels and icons for mapping the buttons.
const functionsData = [{label: "Edit Roster", "icon": EditRosterIcon, color: "#5ef8ed", restricted: true},
{label: "Confirm Roster", "icon": ConfirmRosterIcon, color: "#BCE7FD", restricted: true},
{label: "My Roster", "icon": MyRosterIcon, color: "#BCE7FD", restricted: false}, 
{label: "Staff Roster", "icon": StaffRosterIcon, color: "#5ef8ed", restricted: false}, 
{label: "On-Call Cheatsheet", "icon": CheatsheetIcon, color: "#5ef8ed", restricted: false, "href": `https://${serverConfig.host}:${serverConfig.port}/oncall/On Call Cheat Sheet.docx`}, 
{label: "Authorisation Form", "icon": AuthorisationIcon, color: "#BCE7FD", restricted: false, "href": `https://${serverConfig.host}:${serverConfig.port}/oncall/Callback Authorisation Form.doc`}];

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

    // Get the current user
    const currentUser = useUser((state) => state.userCredentials);

    return (
        <div className="on-call-functions-container">
            <div className="on-call-functions-header flex-c">On-Call Utilities</div>
            {functionsData.map((entry, index) => {
                const type = entry.label.toLowerCase().replace(/\s/g, "-");
                const design = [0, 3, 4].includes(index) ? "main-link-button" : "alternate-link-button";
                if (modalLinkButtons.includes(type)) {
                    return (
                        <div key={`${entry.label}-key`} className="on-call-function-container flex-c size-100">
                            <button className={`on-call-function-button flex-c-col ${type} ${design}`} onClick={!entry.restricted || (entry.restricted && onCallAdministrators.includes(currentUser.user)) ? () => showForm(setFormVisibile, setFormType, type) : null }>
                                {!entry.restricted || (entry.restricted && onCallAdministrators.includes(currentUser.user)) ? <entry.icon color={entry.color} size="2.7vw"></entry.icon> : <PadlockIcon color={entry.color} size="2.7vw"></PadlockIcon>}
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
                        <div key={`${entry.label}-key`} className="on-call-function-container flex-c size-100" >
                            <a className={`on-call-function-button flex-c-col ${type} ${design}`} href={entry.href} download>
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