import { useUser } from "../StateStore";
import { useRef } from "react";
import { Input } from "../Input";
import { VendorArrow } from "../../svg";

function uploadUpdatedResource(selectedData, formContainer, currentDocument, closeForm, queryClient, showMessage, closeDialog) {
    console.log(showMessage)
    const fileInput = formContainer.current.querySelector(".file-input");
    const file = fileInput.files[0];
    const fileExtension = file.name.split('.').slice(-1)[0];
    
    // Validate the supplied inputs for file presence and correct type.
    if (fileInput.files.length === 0) {
        showMessage("warning", "No file has been selected. Please select a file and try again.")
        return
    } 
    else if (fileExtension !== currentDocument.extension) {
        showMessage("warning", "The supplied file is not the same type as the existing document. Please verify you are editing the correct file and contact an administrator if required.")
        return 
    }
    
    // Add file to multipart form data and begin upload
}

function deleteResource() {

}

export function DocumentEditRemove({selectedData, currentDocument, closeForm, queryClient, showMessage, closeDialog}) {
    
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
                <div className="update-button" onClick={() => uploadUpdatedResource(selectedData, formContainer, currentDocument, closeForm, queryClient, showMessage, closeDialog)}>Upload Document</div>
                {documentDeletePermissions && <div className="update-button delete-button">Delete Document</div>}
            </div>  
        </div>
    )
}