import { ModalSkeleton } from "./ModalSkeleton"
import { serverConfig } from "../server";
import { RequestDetails } from "./RequestDetails";
import { getDateTimeData } from "../utils/time-date-utils";
import { FormButton } from "./FormButton";
import { useUser } from "./StateStore";

async function approveRequest(request, closeModal, showMessage, closeDialog, queryClient) {

    // Show the uploading spinner dialog while uploading.
    showMessage("uploading", `Approving Request Data`)
      
    try {
    
        // Post the form data to the server. 
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/ApproveRequest`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })

        const data = await res.json();
        if (data.type === "Error") {
            closeDialog();
            showMessage("error", `${data.message}.`);
        }
        else {
            
            // Need to update app data.
            queryClient.invalidateQueries('dataSource');

            closeDialog();
            showMessage("info", 'Resources have been successfully updated!');
            setTimeout(() => {
                closeDialog();
                closeModal();
            }, 1600);
        }
    }
    catch (error) {
        showMessage("error", error.message);
    }

}

function generateData(requestsData) {
    const formattedRequestData = [];
    requestsData.forEach((device) => {
        if (device.serviceManual) {
            device.serviceManual.forEach((entry) => {
                formattedRequestData.push({requestType: "Service Manual", model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.userManual) {
            device.userManual.forEach((entry) => {
                formattedRequestData.push({requestType: "User Manual", model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.config) {
            device.config.forEach((entry) => {
                formattedRequestData.push({requestType: "Configurations", model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.software) {
            device.software.forEach((entry) => {
                formattedRequestData.push({requestType: "Software", model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.documents) {
            device.documents.forEach((entry) => {
                formattedRequestData.push({requestType: "Documents", model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.passwords) {
            device.passwords.forEach((credentialType) => {
                credentialType.values.forEach((passwordValue) => {
                    formattedRequestData.push({requestType: "Passwords", model: device.model, manufacturer: device.manufacturer, credentialType: credentialType.type, ...passwordValue})
                })
            })
        }
    });

    return formattedRequestData;
}

export function ViewRequests({requestsData, closeModal, showMessage, closeDialog, queryClient}) {
    
    const requests = generateData(requestsData);

    // Get the current user from the state store.
    const currentUser = useUser((state) => state.userCredentials);
    const adminAccess = currentUser.permissions === "admin";
    
    return (
        <>
            <ModalSkeleton type="view-requests" closeModal={closeModal}>
                <div className="modal-display" style={{justifyContent: 'flex-start', width: 700 + 'px', paddingBottom: 40 + 'px'}}>
                    {requests.map((request, index) => {
                        const ms = request.timestamp;
                        const dateTimeData = getDateTimeData(Number(ms))
                        return (
                            <div key={`request-${index}`} className="request-container">
                                <div className="request-image-header flex-c">
                                    {["jpg", "JPG", "png", "PNG"].includes(request.staffPhotoExtension) ? <img className="request-image" src={`https://${serverConfig.host}:${serverConfig.port}/images/staff/${request.requestorId}.${request.staffPhotoExtension}`} alt="employee"></img>
                                    : <img className="request-image" src={`https://${serverConfig.host}:${serverConfig.port}/images/staff/blank-profile.png`} alt="Fallback"></img>}
                                    <div className="request-summary flex-c-col">
                                        <span><span className="request-highlight">{request.requestor}</span><span> has requested an update to the </span><span className="request-highlight">{request.requestType}</span><span> for the </span><span className="request-highlight">{`${request.manufacturer} ${request.model}`}</span></span>
                                        <span className="request-time">{`${dateTimeData.day}, ${dateTimeData.requestTime}`}</span>
                                    </div>
                                </div>
                                <div className="request-details">
                                    <RequestDetails request={request} ></RequestDetails>
                                </div>
                                {adminAccess && <div className="form-buttons" style={{marginBottom: 0 + 'px'}}>
                                    <FormButton content="Approve" btnColor="#D4FB7C" marginTop="0px" onClick={() => approveRequest(request, closeModal, showMessage, closeDialog, queryClient)}/> 
                                    <FormButton content="Deny" btnColor="#EE467B" marginTop="0px"/>
                                </div>}
                                {currentUser.user === request.requestor && <div className="form-buttons" style={{marginBottom: 0 + 'px'}}>
                                    <FormButton content="Cancel" btnColor="#EE467B" marginTop="0px"/>
                                </div>}
                            </div>
                        )
                    })}
                </div>
            </ModalSkeleton>
        </>
        
    )
}