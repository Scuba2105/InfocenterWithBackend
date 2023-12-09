import { useRef } from "react";
import { FormButton } from "../FormButton";
import { VendorArrow } from "../../svg";
import { Input } from "../Input";
import { useUser } from "../StateStore";
import { delayFunctionInitiation } from "../../utils/utils";

export function ConfigEditRemove({currentConfig, closeForm, queryClient, showMessage, closeDialog}) {
    
    const formContainer = useRef(null);
    console.log(currentConfig);
    // Get the permissions to delete the config file.
    const currentUser = useUser((state) => state.userCredentials);
    const configDeletePermissions = currentUser.permissions === "admin";

    return (
        <div className="modal-display" ref={formContainer}>
            <div className="previous-page-arrow-container">
                <button className="previous-page-arrow-button form-btn-transition flex-c" onClick={() => delayFunctionInitiation(() => closeForm())}>
                    <VendorArrow size="2.31vh" color="white" identifier="previous-page-arrow"></VendorArrow>
                    <label className="previous-page-arrow-label">Back to View Documents</label>
                </button>
            </div>
            <h3 className="documents-heading-edit">{`Edit ${currentConfig[1]} ${currentConfig[2]} ${currentConfig[0]} Config File`}</h3>
            <form className="documents-edit-form">
                <Input inputType="file" identifier="updated-file" labelText="Updated Configuration File"></Input>
                <div className="form-buttons">
                    {configDeletePermissions && <FormButton content="Delete" btnColor="#EE467B" marginTop="0px" />}
                    <FormButton content="Upload" btnColor="#D4FB7C" marginTop="0px" /> 
                </div>
            </form>
        </div>
    )
}