import { useUser } from "../StateStore";
import { Input } from "../Input";
import { VendorArrow } from "../../svg";

function uploadUpdatedResource() {

}

function deleteResource() {

}

export function DocumentEditRemove({currentDocument, closeForm, queryClient, showMessage, closeDialog}) {

    // Get user state from Zustand state
    const currentUser = useUser((state) => state.userCredentials);
    const documentDeletePermissions = (currentUser.permissions === "admin");    

    return (
        <div className="modal-display">
            <div className="previous-page-arrow-container flex-c" onClick={closeForm}>
                <VendorArrow size="2.31vh" color="white" identifier="previous-page-arrow"></VendorArrow>
                <label className="previous-page-arrow-label">Previous Page</label>
            </div>
            <h3 className="documents-heading">{`Edit ${currentDocument.description}`}</h3>
            <Input inputType="file" identifier="updated-file" labelText="Updated Document"></Input>
            <div className="form-buttons">
                <div className="update-button" onClick={() => uploadUpdatedResource(currentDocument, closeForm, queryClient, showMessage, closeDialog)}>Upload Document</div>
                {documentDeletePermissions && <div className="update-button delete-button">Delete Document</div>}
            </div>  
        </div>
    )
}