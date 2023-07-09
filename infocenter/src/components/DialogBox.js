import { capitaliseFirstLetters } from "../utils/utils";

export function DialogBox({children, dialogOpen, dialogMessage, closeDialog}) {
    
    const dialogType = dialogMessage.type;
    const message = dialogMessage.message;

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
        return (
            <>
                <dialog open id="dialog-background">
                    <div id="dialog-box">
                        <div className="dialog-title" style={dialogType === "error" ? {color: "#ed1b2e", backgroundColor: "#fbd4d7"} : 
                        dialogType === "info" ? {color: "#4052c5", backgroundColor: "#ced4fa"} : 
                        {color: "#fea500", backgroundColor: "#fdefd6"}}>
                            <img className="info-icon" src={`http://localhost:5000/images/${dialogType}-icon.jpg`} alt="information"></img>
                            <h3>{dialogType === "info" ? "Save Notification" : `${capitaliseFirstLetters(dialogType)} Message`}</h3>
                        </div>
                        <div className={dialogType === "info" ? "dialog-body-info" : "dialog-body"}>
                            <p>{message}</p>
                            {(dialogType === "error" || dialogType === "warning") && <button id="closeBtn" value="default" onClick={closeDialog}>Close</button>}
                        </div>
                    </div>
                </dialog>
                
            </>
        );
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
