import { useUser } from "../StateStore";
import { useRef, useEffect } from "react";
import { Input } from "../Input";
import { VendorArrow } from "../../svg";
import { serverConfig } from "../../server"
import { useConfirmation } from "../StateStore";
import { FormButton } from "../FormButton";
import { delayFunctionInitiation } from "../../utils/utils";

async function uploadUpdatedResource(selectedData, formContainer, currentDocument, closeForm, queryClient, showMessage, closeDialog) {
    const fileInput = formContainer.current.querySelector(".file-input");
    const file = fileInput.files[0];
    const existingFileName = currentDocument.link.split("/").slice(-1)[0];
    
    // Validate that a file has been supplied for upload.
    if (fileInput.files.length === 0) {
        showMessage("warning", "No file has been selected. Please select a file and try again.")
        return
    } 

    // Validate the file is of the correct type.
    const uploadFileName = file.name;
    if (uploadFileName !== existingFileName) {
        showMessage("warning", "The supplied file is not the same as the existing document. Please verify you are editing the correct file and have not renamed it. If problem persists contact an administrator if required.")
        return 
    }
    
    // Add file to multipart form data and begin upload. Always add files last so it populates correctly on backend.
    const formData = new FormData();
    formData.set("model", selectedData.model);
    formData.set("description", currentDocument.description);
    formData.set("filepath", currentDocument.link);
    formData.set("updated-document", file, `${existingFileName}`);    
    
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

function deleteResource(showMessage) {
    // Have user confirm to proceed if changing mandatory data
    showMessage("confirmation", "You are about to delete the resource permanently from the server. Please confirm you wish to proceed or cancel to prevent deletion.");
}

export function DocumentEditRemove({selectedData, currentDocument, closeForm, queryClient, showMessage, closeDialog}) {
    
    // Create ref container form getting form element
    const formContainer = useRef(null);

    // Get user state from Zustand state
    const currentUser = useUser((state) => state.userCredentials);
    const documentDeletePermissions = (currentUser.permissions === "admin");    

    // Get the confirmation result from Zustand state store.
    const confirmationResult = useConfirmation((state) => state.updateConfirmation);
    const resetConfirmationStatus = useConfirmation((state) => state.resetConfirmation);

    // Run effect hook if confirmation result provided to complete delete after re-render
    useEffect(() => {
        if (confirmationResult === "proceed") {

            async function proceedwithUpload() {
                showMessage("uploading", `Deleting ${selectedData.model} Data`);

                // Create the object to be sent in the request body.
                const uploadData = {model: selectedData.model, document: currentDocument} 
                
                try {

                    // Post the data to the server  
                    const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/DeleteDocument`, {
                            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
                            mode: "cors", // no-cors, *cors, same-origin
                            headers: {
                                "Content-Type": "application/json",
                            },
                            redirect: "follow", // manual, *follow, error
                            referrerPolicy: "no-referrer",
                            body: JSON.stringify(uploadData),
                    })
        
                    const data = await res.json();

                    if (data.type === "Error") {
                        closeDialog();
                        showMessage("error", `${data.message} If the issue persists please contact an administrator.`);
                    }
                    else {                            
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
                    showMessage("error", `${error.message}.`)
                }
            }
            proceedwithUpload();
        }
        else if (confirmationResult === "cancel") {
            resetConfirmationStatus();            
        }
        return () => {
            resetConfirmationStatus();
        }    
    }, [confirmationResult, resetConfirmationStatus, closeDialog, showMessage, queryClient, closeForm, currentDocument, selectedData]);
     

    return (
        <div className="modal-display" ref={formContainer}>
            <div className="previous-page-arrow-container">
                <button className="previous-page-arrow-button form-btn-transition flex-c" onClick={() => delayFunctionInitiation(() => closeForm())}>
                    <VendorArrow size="2.31vh" color="white" identifier="previous-page-arrow"></VendorArrow>
                    <label className="previous-page-arrow-label">Back to View Documents</label>
                </button>
            </div>
            <h3 className="documents-heading-edit">{`Edit ${currentDocument.description}`}</h3>
            <form className="documents-edit-form">
                <Input inputType="file" identifier="updated-file" labelText="Updated Document"></Input>
                <div className="form-buttons">
                    {documentDeletePermissions && <FormButton content="Delete" btnColor="#EE467B" marginTop="0px" onClick={() => deleteResource(showMessage)} />}
                    <FormButton content="Upload" btnColor="#D4FB7C" marginTop="0px" onClick={() => uploadUpdatedResource(selectedData, formContainer, currentDocument, closeForm, queryClient, showMessage, closeDialog)} /> 
                </div>
            </form>
        </div>
    )
}