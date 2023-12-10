import { useRef } from "react";
import { FormButton } from "../FormButton";
import { VendorArrow } from "../../svg";
import { Input } from "../Input";
import { serverConfig } from "../../server";
import { delayFunctionInitiation } from "../../utils/utils";

async function uploadConfigUpdates(formContainer, currentConfig, device, hospital, department, closeForm, queryClient, showMessage, closeDialog) {
    const configTypeInput = formContainer.querySelectorAll(".text-input")[0];
    const softwareInput = formContainer.querySelectorAll(".text-input")[1];
    const dateInput = formContainer.querySelector(".date-input");
    const fileInput = formContainer.querySelector(".file-input");

    // Initialise the update config data.
    const formData = new FormData();

    // Initialise the device and hospital entries in the form data.
    formData.set("device", device);
    formData.set("hospital", hospital);
    formData.set("existing-filename", currentConfig.join("_"));

    // Get the current config file type from the current array.
    const currentConfigType = currentConfig[currentConfig.length - 1].split(".").slice(-1)[0];

    let typeOptionsValue, softwareValue, dateValue, fileSelected
    if (fileInput.files[0]) {
        
        // Compare existing file type to new file type.
        const updatedFileType = fileInput.files[0].name.split(".").slice(-1)[0];
        if (currentConfigType !== updatedFileType) {
            showMessage("warning", "The updated config file does not have the same file type as the existing file. Please confirm you have selected the correct file and try again. If the issue persists contact an administrator.")
            return
        }
        fileSelected = true;
    }   
    
    // Sanitise the config input and store value if changed.
    if (configTypeInput.value.trim() !== "") {
        // Parse options string. Filter out Intellivue monitors so options string can be parsed otherwise format the data appropriately.
        if (/^MX/.test(device) || device === 'X2' || device === 'X3') {
                const regex = configTypeInput.value.trim().match(/[A-Za-z]\d{2}/ig);
                if (!regex) {
                    showMessage("warning", "The entered device options are not valid Philips software option codes. Please update the values accordingly and try again.")
                    return
                }
                typeOptionsValue = regex.join('-').toUpperCase();
        }
        else {
            typeOptionsValue = configTypeInput.value.trim();
        }
    }
    
    // Sanitise the software input and store value if changed.
    if (softwareInput.value.trim() !== "") {
        softwareValue = softwareInput.value.trim();
    }

    // Send a message if no data has been changed. Otherwise perform the appropriate response depending on whether a file has been updated or not.
    if (dateInput.value.trim() === "" && fileSelected) {
        showMessage("warning", "The date the config was created has not been entered. Please enter a valid date and try again.")
        return
    }
    else if (!fileSelected) { 
        // Update the filename accordingly.

        // Check if software or type/options are not null and update accordingly.
        if (!typeOptionsValue && !softwareValue) {
            showMessage("warning", "No data has been updated for the configuration.");
            return
        }
        // Update the congiguration name accordingly if software or type options fields provided.
        const updatedConfigArray = currentConfig.map(entry => entry)

        // Update the type/options value if valid input provided.
        if (typeOptionsValue) {
            updatedConfigArray[3] = typeOptionsValue;
        }
        // Update the software value if valid input provided.
        if (softwareValue) {
            updatedConfigArray[4] = softwareValue; 
        }
        const updatedConfigName = updatedConfigArray.join("_");
        formData.set("updated-filename", updatedConfigName);
    }
    else { 
        // Append the updated config file to the formData with the new filename.

        // Copy the current config into a new array and update the congiguration name accordingly if software or type options fields provided.
        const updatedConfigArray = currentConfig.map(entry => entry)
        
        // Set the dateValue and update the date.<file extension> entry in the config array.
        dateValue = dateInput.value.trim();
        const dateArray = dateValue.split("-");
        const newDate = `${dateArray[2]}.${dateArray[1]}.${dateArray[0]}`;
        updatedConfigArray[6] = `${newDate}.${currentConfigType}`

        if (typeOptionsValue) {
            updatedConfigArray[3] = typeOptionsValue;
        }
        // Update the software value if valid input provided.
        if (softwareValue) {
            updatedConfigArray[4] = softwareValue; 
        }
        const updatedConfigName = updatedConfigArray.join("_");
        formData.set("updated-config-file", fileInput.files[0], updatedConfigName);
    }

    // Upload the Form Data
    // Show the uploading spinner dialog while uploading.
    //showMessage("uploading", `Updating ${device} Config Data`)
      
    try {    
        // Post the form data to the server. 
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/UpdateConfigurations`, {
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

export function ConfigEditRemove({currentConfig, device, hospital, department, closeForm, queryClient, showMessage, closeDialog}) {
    
    const formContainer = useRef(null);
    
    return (
        <div className="modal-display" ref={formContainer}>
            <div className="previous-page-arrow-container" style={{marginTop: 20 + 'px'}}>
                <button className="previous-page-arrow-button form-btn-transition flex-c" onClick={() => delayFunctionInitiation(() => closeForm())}>
                    <VendorArrow size="2.31vh" color="white" identifier="previous-page-arrow"></VendorArrow>
                    <label className="previous-page-arrow-label">Back to View Configuration</label>
                </button>
            </div>
            <div className="config-edit-heading-container flex-c-col">
                <span>{`Update Configuration Details`}</span>
                <span>{`${hospital}, ${department}`}</span>
            </div>
            <form className="config-edit-form" >
                <div className="config-edit-inputs-container">
                    <Input inputType='text' identifier='config-data' labelText={/^MX/.test(device) || device === 'X2' || device === 'X3' ? "Options" : "Configuration Type"} placeholdertext={/^MX/.test(device) || device === 'X2' || device === 'X3' ? "eg. A06, H10, C12 etc." : 'eg. XML, DAT, filetype, description etc.'}/>
                    <Input inputType='text' identifier='config-data' labelText='Software Rev.' placeholdertext='eg. M.03.01, L.01.02'/>
                    <Input inputType='date' identifier='date-entry' labelText='Date Updated'/>
                    <Input inputType="file" identifier="updated-file" labelText="Updated Configuration File"></Input>
                </div>
                <div className="form-buttons">
                    <FormButton content="Delete" btnColor="#EE467B" marginTop="0px" />
                    <FormButton content="Upload" btnColor="#D4FB7C" marginTop="0px" onClick={() => uploadConfigUpdates(formContainer.current, currentConfig, device, hospital, department, closeForm, queryClient, showMessage, closeDialog)}/> 
                </div>
            </form>
        </div>
    )
}