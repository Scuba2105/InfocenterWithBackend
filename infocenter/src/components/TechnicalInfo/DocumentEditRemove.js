import { useUser } from "../StateStore";
import { useRef } from "react";
import { Input } from "../Input";
import { VendorArrow } from "../../svg";
import { serverConfig } from "../../server"

async function uploadUpdatedResource(selectedData, formContainer, currentDocument, closeForm, queryClient, showMessage, closeDialog) {
    
    const fileInput = formContainer.current.querySelector(".file-input");
    const file = fileInput.files[0];
    
    // Validate that a file has been supplied for upload.
    if (fileInput.files.length === 0) {
        showMessage("warning", "No file has been selected. Please select a file and try again.")
        return
    } 

    // Validate the file is of the correct type.
    const fileExtension = file.name.split('.').slice(-1)[0];
    if (fileExtension !== currentDocument.extension) {
        showMessage("warning", "The supplied file is not the same type as the existing document. Please verify you are editing the correct file and contact an administrator if required.")
        return 
    }
    
    // Add file to multipart form data and begin upload. Always add files last so it populates correctly on backend.
    const formData = new FormData();
    formData.set("model", selectedData.model);
    formData.set("description", currentDocument.description);
    formData.set("extension", currentDocument.extension);
    formData.set("updated-document", file, `${currentDocument.description}.${currentDocument.extension}`);
    
    
    // Show the uploading spinner dialog while uploading.
    showMessage("uploading", `Uploading ${selectedData.model} Data`)
      
    try {
    
        // Post the form data to the server. 
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/UpdateDocuments`, {
                method: "PUT", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                body: formData
        })

        const data = await res.json();
        if (data.type === "Error") {
            closeDialog();
            showMessage("error", `${data.message}.`);
        }
        else {
            // Need to clear formData at this point
            for (const pair of formData.entries()) {
                formData.delete(pair[0]);
            }

            // Need to update app data.
            queryClient.invalidateQueries('dataSource');

            closeDialog();
            showMessage("info", 'Resources have been successfully updated!');
            setTimeout(() => {
                closeDialog();
                closeForm();
            }, 1600);
        }
    }
    catch (error) {
        showMessage("error", error.message);
    }
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