import { useConfirmation } from "./StateStore";
import { capitaliseFirstLetters, delayFunctionInitiation } from "../utils/utils";
import { serverConfig } from "../server";

function proceedWithUpdate(proceedUpdate, closeDialog) {
    delayFunctionInitiation(() => {
        proceedUpdate();
        closeDialog();
    })
} 

function cancelAndQuitUpdate(cancelUpdate, closeDialog) {
    delayFunctionInitiation(() => {
        cancelUpdate();
        closeDialog();
    })
}

export function DialogBox({children, dialogOpen, dialogMessage, closeDialog}) {
    
    const dialogType = dialogMessage.type;
    const message = dialogMessage.message;

    const proceedUpdate = useConfirmation((state) => state.proceedUpdate);
    const cancelUpdate = useConfirmation((state) => state.cancelUpdate);
    
    if (dialogOpen) {
        if (dialogType === "uploading") {
            return (
                <>
                    <dialog open id="dialog-background" className="flex-c">
                        <div id="uploading-dialog" className="flex-c-col">
                            <p>Please Wait...</p>
                            <div className="upload-body flex-c">
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
                    <dialog open id="dialog-background" className="flex-c">
                        <div id="dialog-box">
                            <div className="dialog-title flex-c" style={{color: "white", backgroundColor: "#fdc046"}}>
                                <img className="dialog-icon" src={`https://${serverConfig.host}:${serverConfig.port}/images/warning-icon.png`} alt="warning"></img>
                                <h3>Confirmation to Proceed</h3>
                            </div>
                            <div className={dialogType === "info" ? "dialog-body-info flex-c-col" : "dialog-body flex-c-col"}>
                                <p>{message}</p>
                                <div className="confirmation-btn-container flex-c">
                                    <button className="cancel-btn flex-c form-btn-transition" value="default" onClick={() => cancelAndQuitUpdate(cancelUpdate, closeDialog)}>Cancel</button>
                                    <button className="proceed-btn flex-c form-btn-transition" value="default" onClick={() => proceedWithUpdate(proceedUpdate, closeDialog)}>Proceed</button>
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
                    <dialog open id="dialog-background" className="flex-c">
                        <div id={dialogType === "error-request" ? "dialog-box-error-request" : "dialog-box"}>
                            <div className="dialog-title flex-c" style={dialogType === "error" || dialogType === "error-request" ? {color: "white", backgroundColor: "#ed1b2e"} : 
                            dialogType === "info" ? {color: "white", backgroundColor: "#4052c5"} : 
                            {color: "white", backgroundColor: "#fdc046"}}>
                                <img className="dialog-icon warning-icon" src={`https://${serverConfig.host}:${serverConfig.port}/images/${dialogType.split("-")[0]}-icon.png`} alt="information"></img>
                                <h3>{dialogType === "info" ? "Save Notification" : `${capitaliseFirstLetters(dialogType).split("-")[0]} Message`}</h3>
                            </div>
                            <div className={dialogType === "info" ? "dialog-body-info flex-c-col" : dialogType === "error-request" ? "dialog-body-error-request flex-c-col" : "dialog-body flex-c-col"}>
                                {dialogType === "error-request" ?
                                    <>
                                        <p>An error occurred generating the request form;</p>
                                        <p>{message}</p>
                                        <p>Try again and if the issue persists contact an Administrator</p>
                                    </> :
                                    <p>{message}</p>}
                                {(dialogType === "error" || dialogType === "warning" || dialogType === "error-request") && <button id="closeBtn" className="form-btn-transition" value="default" onClick={() => delayFunctionInitiation(() => closeDialog())}>Close</button>}
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
