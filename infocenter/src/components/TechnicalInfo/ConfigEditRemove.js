import { useRef } from "react";
import { FormButton } from "../FormButton";
import { VendorArrow } from "../../svg";
import { Input } from "../Input";
import { delayFunctionInitiation } from "../../utils/utils";

function uploadConfigUpdates(formContainer, currentConfig, device, hospital, department, closeForm, queryClient, showMessage, closeDialog) {
    const configTypeInput = formContainer.querySelectorAll(".text-input")[0];
    const softwareInput = formContainer.querySelectorAll(".text-input")[1];
    const dateInput = formContainer.querySelector(".date-input");
    const fileInput = formContainer.querySelector(".file-input");

    // Initialise the update config data.
    const formData = new FormData();

    // Initialise the device and hospital entries in the form data.
    formData.set("device", device);
    formData.set("hospital", hospital);
    formData.set("existing-file", currentConfig.join("_"));

    // Validate the inputs values and store valid values used to construct filename.
    let typeOptionsValue, softwareValue, dateValue, fileSelected
    if (fileInput.files[0]) {
        // Get the current config file type from existing file name and compare to new file name.
        const currentConfigType = currentConfig[currentConfig.length - 1].split(".").slice(-1)[0];
        const updatedFileType = fileInput.files[0].name.split(".").slice(-1)[0];
        if (currentConfigType !== updatedFileType) {
            showMessage("warning", "The updated config file does not have the same file type as the existing file. Please confirm you have selected the correct file and try again. If the issue persists contact an administrator.")
            return
        }
        fileSelected = true;
    }        
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
        typeOptionsValue = configTypeInput.value.trim();
    }
    if (softwareInput.value.trim() !== "") {
        softwareValue = softwareInput.value.trim();
    }
    if (dateInput.value.trim() === "" && fileSelected) {
        showMessage("warning", "The date the config was created has not been entered. Please enter a valid date and try again.")
        return
    }
    else if (!fileSelected) {
        // Check if software or type/options are not null and update accordingly.
        if (!typeOptionsValue && !softwareValue) {
            showMessage("warning", "No data has been updated for the configuration.");
            return
        }
        // Update the congiguration name accordingly.
        console.log(typeOptionsValue, softwareValue);
    }
    else {
        // Set the dateValue and create new file name from supplied input values.
        dateValue = dateInput.value.trim();
        console.log(typeOptionsValue, softwareValue, dateValue);
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