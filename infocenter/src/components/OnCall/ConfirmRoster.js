import { useRef } from "react";
import { Input } from "../Input";

function uploadData(formContainer, queryClient, showMessage, closeModal, closeDialog) {

}

export function ConfirmRoster({queryClient, showMessage, closeModal, closeDialog, page}) {

    const formContainer = useRef(null);

    return (
        <div className="modal-display">
            <div className="confirm-instruction">
                <p>Please select the Start Date and End Date to confirm</p>
                <p>the on-call roster for the chosen week.</p>
            </div>
            <form className="confirm-roster-form" ref={formContainer}>
                <Input inputType="date" identifier="date-change" labelText={"Start Date"}></Input>
                <Input inputType="date" identifier="date-change" labelText={"End Date"}></Input>
                <div className="update-button edit-roster-update-btn" onClick={() => uploadData(formContainer, queryClient, showMessage, closeModal, closeDialog, page)}>Upload Data</div>
            </form>
        </div>
    )
}