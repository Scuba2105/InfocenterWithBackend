import { useUser } from "../StateStore";
import { Input } from "../Input";
import { VendorArrow } from "../../svg";

export function DocumentEditRemove({currentDocument, closeForm, setDocumentsEditVisible}) {

    // Get user state from Zustand state
    const currentUser = useUser((state) => state.userCredentials);
    const documentDeletePermissions = (currentUser.permissions === "admin");    

    return (
        <div className="modal-display">
            <div className="previous-page-arrow-container flex-c" onClick={() => closeForm(setDocumentsEditVisible)}>
                <VendorArrow size="2.31vh" color="white" identifier="previous-page-arrow"></VendorArrow>
                <label className="previous-page-arrow-label">Previous Page</label>
            </div>
            <h3 className="documents-heading">{`Edit ${currentDocument.description}`}</h3>
            <Input inputType="file" identifier="updated-file" labelText="Updated Document"></Input>
            <div className="form-buttons">
                <div className="update-button">Upload Document</div>
                {documentDeletePermissions && <div className="update-button delete-button">Delete Document</div>}
            </div>  
        </div>
    )
}