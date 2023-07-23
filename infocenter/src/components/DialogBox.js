import { useConfirmation } from "./StateStore";
import { capitaliseFirstLetters } from "../utils/utils";
import { serverConfig } from "../server";

export function DialogBox({children, dialogOpen, dialogMessage, closeDialog}) {
    
    const dialogType = dialogMessage.type;
    const message = dialogMessage.message;

    const proceedUpdate = useConfirmation((state) => state.proceedUpdate);
    const cancelUpdate = useConfirmation((state) => state.cancelUpdate);
    
    function proceedWithUpdate() {
        proceedUpdate();
        closeDialog();
    } 

    function cancelAndQuitUpdate() {
        cancelUpdate();
        closeDialog();
    }
    
    
    if (dialogOpen) {
        if (dialogType === "uploading") {
            return (
                <>
                    <dialog open id="dialog-background">
                        <div id="uploading-dialog">
                            <p>Please Wait...</p>
                            <div className="upload-body">
                                <div className="spinner"></div>
                                <p>{`${message}...`}</p>
                            </div>
                        </div>
                    </dialog>
                       
                </>
            );
        }
        else if (dialogType === "confirmation") {
            return (
                <>
                    <dialog open id="dialog-background">
                        <div id="dialog-box">
                            <div className="dialog-title" style={{color: "#fea500", backgroundColor: "#fdefd6"}}>
                                <img className="info-icon" src={`http://${serverConfig.host}:${serverConfig.port}/images/warning-icon.jpg`} alt="warning"></img>
                                <h3>Confirmation to Proceed</h3>
                            </div>
                            <div className={dialogType === "info" ? "dialog-body-info" : "dialog-body"}>
                                <p>{message}</p>
                                <div className="confirmation-btn-container">
                                    <button className="cancel-btn" value="default" onClick={cancelAndQuitUpdate}>Cancel</button>
                                    <button className="proceed-btn" value="default" onClick={proceedWithUpdate}>Proceed</button>
                                </div>
                            </div>
                        </div>
                    </dialog>
                </>
            );
        }
        else {
            return (
                <>
                    <dialog open id="dialog-background">
                        <div id={dialogType === "error-request" ? "dialog-box-error-request" : "dialog-box"}>
                            <div className="dialog-title" style={dialogType === "error" || dialogType === "error-request" ? {color: "#ed1b2e", backgroundColor: "#fbd4d7"} : 
                            dialogType === "info" ? {color: "#4052c5", backgroundColor: "#ced4fa"} : 
                            {color: "#fea500", backgroundColor: "#fdefd6"}}>
                                <img className="info-icon" src={`http://${serverConfig.host}:${serverConfig.port}/images/${dialogType.split("-")[0]}-icon.jpg`} alt="information"></img>
                                <h3>{dialogType === "info" ? "Save Notification" : `${capitaliseFirstLetters(dialogType).split("-")[0]} Message`}</h3>
                            </div>
                            <div className={dialogType === "info" ? "dialog-body-info" : dialogType === "error-request" ? "dialog-body-error-request" : "dialog-body"}>
                                {dialogType === "error-request" ?
                                    <>
                                        <p>An error occurred generating the request form;</p>
                                        <p>{message}</p>
                                        <p>Try again and if the issue persists contact an Administrator</p>
                                    </> :
                                    <p>{message}</p>}
                                {(dialogType === "error" || dialogType === "warning" || dialogType === "error-request") && <button id="closeBtn" value="default" onClick={closeDialog}>Close</button>}
                            </div>
                        </div>
                    </dialog>
                </>
            );
        }
    }
    else {
        return (
            <>
                <dialog id="noDialog">
                    {children}
                </dialog>
            </>
        );
    }
}
