import { useRef } from "react";
import { Input } from "../Input";
import { serverConfig } from "../../server";
import { FormButton } from "../FormButton";

async function uploadData(formContainer, updateData, queryClient, showMessage, closeModal, closeDialog) {
    const dateInputs = formContainer.current.querySelectorAll(".date-input")
    for (const [index, input] of dateInputs.entries()) {
        if (index === 0) {
            // Check if start date corresponds to a Monday
            const startingDate = new Date(input.value)
            const numericDay = startingDate.getDay();
            if (numericDay !== 1) {
                showMessage("warning", "The Start Date of the confirmation window is not a Monday. Please correct this and try again.") 
                return;
            }
            updateData.current.startDate = input.value;
        }
        else {
            // Check if the end date corresponds to Sunday
            const endingDate = new Date(input.value)
            const numericDay = endingDate.getDay();
            if (numericDay !== 0) {
                showMessage("warning", "The End Date of the confirmation window is not a Sunday. Please correct this and try again.") 
                return
            }
            updateData.current.endDate = input.value;
        }
    }

    // Show the uploading dialog when sending to server
    showMessage("uploading", `Uploading on-call roster changes`);

    // Start the post request
    try {
        // Post the data to the server  
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/OnCall/confirm`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData.current),
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

export function ConfirmRoster({queryClient, showMessage, closeModal, closeDialog, page}) {

    const formContainer = useRef(null);
    const updateData = useRef({});

    return (
        <div className="modal-display">
            <div className="confirm-instruction">
                <p>Please select the Start Date and End Date to confirm</p>
                <p>the on-call roster for the chosen week.</p>
            </div>
            <form className="confirm-roster-form flex-c-col" ref={formContainer}>
                <Input inputType="date" identifier="date-change" labelText={"Start Date"}></Input>
                <Input inputType="date" identifier="date-change" labelText={"End Date"}></Input>
                <FormButton content="Upload" btnColor="#D4FB7C" marginTop="40px" marginBottom="30px" onClick={() => uploadData(formContainer, updateData, queryClient, showMessage, closeModal, closeDialog, page)} /> 
            </form>
        </div>
    )
}