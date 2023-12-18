import { ModalSkeleton } from "./ModalSkeleton"

function generateData(requestsData) {
    const formattedRequestData = [];
    requestsData.forEach((device) => {
        if (device.serviceManual) {
            device.serviceManual.forEach((entry) => {
                formattedRequestData.push({model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.userManual) {
            device.userManual.forEach((entry) => {
                formattedRequestData.push({model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.config) {
            device.config.forEach((entry) => {
                formattedRequestData.push({model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.software) {
            device.software.forEach((entry) => {
                formattedRequestData.push({model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.documents) {
            device.software.forEach((entry) => {
                formattedRequestData.push({model: device.model, manufacturer: device.manufacturer, ...entry})
            })
        }
        if (device.passwords) {
            device.passwords.forEach((credentialType) => {
                credentialType.values.forEach((passwordValue) => {
                    formattedRequestData.push({model: device.model, manufacturer: device.manufacturer, credentialType: credentialType.type, ...passwordValue})
                })
            })
        }
    });

    return formattedRequestData;
}

export function ViewRequests({requestsData, closeModal, showMessage, closeDialog}) {
    
    const requests = generateData(requestsData);
    console.log(requests);

    return (
        <>
            <ModalSkeleton type="view-requests" closeModal={closeModal}>
                <div className="modal-display">
                    {requests.map((request, index) => {
                        const ms = request.timestamp;
                        const requestDate = new Date(Number(ms))
                        const reqDateString = requestDate.toLocaleDateString();
                        return (
                            <div key={`request-${index}`}>
                                <span>{`${request.model}__${request.manufacturer}__${request.requestor}__${request.requestorId}__${reqDateString}`}</span>
                            </div>
                        )
                    })}
                </div>
            </ModalSkeleton>
        </>
        
    )
}