import { useRef } from "react";
import { FormButton } from "../FormButton";
import { VendorArrow } from "../../svg";
import { Input } from "../Input";
import { useUser } from "../StateStore";
import { delayFunctionInitiation } from "../../utils/utils";

export function ConfigEditRemove({currentConfig, hospital, department, closeForm, queryClient, showMessage, closeDialog}) {
    
    const formContainer = useRef(null);
    
    // Get the permissions to delete the config file.
    const currentUser = useUser((state) => state.userCredentials);
    const configDeletePermissions = currentUser.permissions === "admin";

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
                    <Input inputType='text' identifier='config-data' labelText='Configuration Type' placeholdertext='eg. XML, DAT, filetype, description etc.'/>
                    <Input inputType='text' identifier='config-data' labelText='Software Rev. (optional)' placeholdertext='eg. M.03.01, L.01.02'/>
                    <Input inputType='date' identifier='date-entry' labelText='Date Updated'/>
                    <Input inputType="file" identifier="updated-file" labelText="Updated Configuration File"></Input>
                </div>
                <div className="form-buttons">
                    {configDeletePermissions && <FormButton content="Delete" btnColor="#EE467B" marginTop="0px" />}
                    <FormButton content="Upload" btnColor="#D4FB7C" marginTop="0px" /> 
                </div>
            </form>
        </div>
    )
}