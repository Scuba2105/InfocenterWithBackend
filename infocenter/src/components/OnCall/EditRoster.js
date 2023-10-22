import { useRef } from "react";
import { Input } from "../Input";
import { SelectInput } from "../SelectInput";
import { staffOnCallRoster } from "../../utils/utils";
import { serverConfig } from "../../server";

// Input element types
const inputNames = ["Original Staff Member", "New Staff Member", "Reason", "Start Date", "End Date"]
const inputTypes = ["originalOnCall", "newOnCall", "reason", "startDate", "endDate"];

// List of reasons for On-Call roster changes.
const rosterChangeReasons = ["Sick", "Leave", "Family Reasons", "Other"];

function areDatesValid(startDateInput, endDateInput) {
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (startDate.getTime() <= endDate.getTime()) {
        return true;
    }
    else {
        return false;
    }
}

async function uploadData(formContainer, queryClient, showMessage, closeModal, closeDialog, page) {
    const selectElements = formContainer.current.querySelectorAll("select");
    const inputElements = formContainer.current.querySelectorAll("input");
    const formElements = [...selectElements, ...inputElements];

    // Initialise the upload data object
    const uploadOnCallData = {};

    for (const [index, input] of formElements.entries()) {
        if (input.value === "") {
            showMessage("warning", `The ${inputNames[index]} input values are empty. Please check the date inputs are valid and try again.`)
            return 
        }
        uploadOnCallData[inputTypes[index]] = input.value;
    }

    // Check if original and new selected on-call are not the same person.
    if (uploadOnCallData["originalOnCall"] === uploadOnCallData["newOnCall"]) {
        showMessage("warning", "The Original On-Call Staff Member and the New On-Call Staff Member are the same person. Please fix this and try again");
        return;
    }     
    
    // Check the end date is after the start date.
    if (!areDatesValid(uploadOnCallData["startDate"], uploadOnCallData["endDate"])) {
        showMessage("warning", "The Start Date must be less than or equal to the End Date.");
        return;
    }

    // Show the uploading dialog when sending to server
    showMessage("uploading", `Uploading on-call roster changes`);

    // Start the post request
    try {
        // Post the data to the server  
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/OnCall/edit`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(uploadOnCallData),
        });

        const data = await res.json();

        if (data.type === "Error") {
            closeDialog();
            showMessage("error", `${data.message}. If the issue persists please contact an administrator.`);
        }
        else {                            
            // Need to update app data.
            queryClient.invalidateQueries('dataSource');

            closeDialog();
            showMessage("info", 'Resources have been successfully updated!');
            setTimeout(() => {
                closeDialog();
                closeModal();
            }, 1600);
        }
    }
    catch (error) {
        showMessage("error", `${error.message}.`)
    }
}

export function EditRoster({queryClient, showMessage, closeModal, closeDialog, page}) {

    const formContainer = useRef(null);

    return (
        <div className="modal-display">
            <form className="edit-roster-form" ref={formContainer}>
                <SelectInput type="form-select-input" optionData={staffOnCallRoster} label="Original On-Call Member"></SelectInput>
                <SelectInput type="form-select-input" optionData={staffOnCallRoster} label="New On-Call Member"></SelectInput>
                <SelectInput type="form-select-input" optionData={rosterChangeReasons} label="Reason for Change"></SelectInput>
                <Input inputType="date" identifier="date-change" labelText={"Start Date"}></Input>
                <Input inputType="date" identifier="date-change" labelText={"End Date"}></Input>
                <div className="update-button edit-roster-update-btn" onClick={() => uploadData(formContainer, queryClient, showMessage, closeModal, closeDialog, page)}>Upload Data</div>
            </form>
        </div>
    )
}