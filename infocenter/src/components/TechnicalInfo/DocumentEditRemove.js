import { useUser } from "../StateStore";
import { useRef } from "react";
import { Input } from "../Input";
import { VendorArrow } from "../../svg";

function uploadUpdatedResource(formContainer, currentDocument, closeForm, queryClient, showMessage, closeDialog) {
    const fileInput = formContainer.current.querySelector(".file-input");
    console.log(fileInput.value);
}

function deleteResource() {

}

export function DocumentEditRemove({currentDocument, closeForm, queryClient, showMessage, closeDialog}) {

    // Create ref container form getting form element
    const formContainer = useRef(null);

    // Get user state from Zustand state
    const currentUser = useUser((state) => state.userCredentials);
    const documentDeletePermissions = (currentUser.permissions === "admin");    

    return (
        <div className="modal-display" ref={formContainer}>
            <div className="previous-page-arrow-container flex-c" onClick={closeForm}>
                <VendorArrow size="2.31vh" color="white" identifier="previous-page-arrow"></VendorArrow>
                <label className="previous-page-arrow-label">Previous Page</label>
            </div>
            <h3 className="documents-heading">{`Edit ${currentDocument.description}`}</h3>
            <Input inputType="file" identifier="updated-file" labelText="Updated Document"></Input>
            <div className="form-buttons">
                <div className="update-button" onClick={() => uploadUpdatedResource(formContainer, currentDocument, closeForm, queryClient, showMessage, closeDialog)}>Upload Document</div>
                {documentDeletePermissions && <div className="update-button delete-button">Delete Document</div>}
            </div>  
        </div>
    )
}