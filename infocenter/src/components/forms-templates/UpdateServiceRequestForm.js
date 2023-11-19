import { useRef } from "react";
import { Input } from "../Input";
import { SelectInput } from "../SelectInput";
import { serverConfig } from "../../server";

async function uploadData(formContainer, currentUserId, queryClient, showMessage, closeForm, closeDialog) {
    const serviceAgentInput = formContainer.current.querySelector(".form-select-input");
    const fileInput= formContainer.current.querySelector(".file-input");
    
    // Get the input values and input file.
    const selectedServiceAgent = serviceAgentInput.value;
    const uploadfile = fileInput.files[0];
    
    // Validate the service request form to be uploaded is either pdf or docx.
    const uploadFileExtension = uploadfile.name.split(".").slice(-1)[0];
    
    if (!["pdf", "docx"].includes(uploadFileExtension)) {
       showMessage("warning", "The uploaded service request form must have either a pdf or docx file extension. Please make sure the correct file is being uploaded and try again.") 
        return
    }

    // Create the multipart form data for the POST request.
    const formData = new FormData();
    formData.set("service-agent", selectedServiceAgent);
    formData.set("extension", uploadFileExtension);
    formData.set("current-user-id", currentUserId);
    formData.set("service-request-form", uploadfile, `${selectedServiceAgent}.${uploadFileExtension}`);

    // Show the uploading spinner dialog while uploading.
    showMessage("uploading", `Uploading ${selectedServiceAgent} Request Form`);
      
    try {
        // Post the form data to the server. 
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/UpdateServiceRequestForms/${currentUserId}`, {
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

export function UpdateServiceRequestForms({serviceAgents, currentUserId, queryClient, showMessage, closeForm, closeDialog}) {

    const formContainer = useRef(null)

    return (
        <div className="modal-display">
            <div id="service-request-forms-inputs-container" className="flex-c-col" ref={formContainer} >
                <SelectInput type="form-select-input" optionData={serviceAgents} label="Service Agent"></SelectInput>
                <Input inputType="file" identifier="service-request-file" labelText={"Service Request Form"}></Input>
            </div>
            <div className="update-button service-request-forms-update-btn" onClick={() => uploadData(formContainer, currentUserId, queryClient, showMessage, closeForm, closeDialog)}>Upload Data</div>
        </div>
    )
}