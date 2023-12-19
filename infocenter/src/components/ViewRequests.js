import { ModalSkeleton } from "./ModalSkeleton"
import { serverConfig } from "../server";

const daysLookup = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
const monthsLookup = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

function getDateTimeData(timestamp) {
    const requestDate = new Date(timestamp);
    const currentDate = new Date();
    const requestTime = `${requestDate.getHours()}:${String(requestDate.getMinutes()).length === 1 ? `0${requestDate.getMinutes()}` : requestDate.getMinutes()} ${getTimeSuffix(requestDate.getHours())}`;
    const dayDiff = Math.floor(currentDate - requestDate / (1000*60*60*24));
    const dateTimeObject = {requestTime: requestTime}
    if (dayDiff === 0) {
        dateTimeObject.day = `Today` 
    }
    else if (dayDiff < 5) {
        dateTimeObject.day = `${dayDiff} ${dayDiff === 1 ? "day" : "days"} ago` 
    }
    else {
        const dayOfWeek = daysLookup[requestDate.getDay()];
        const dayOfMonth = requestDate.toLocaleDateString().split("/")[0];
        const month = monthsLookup[requestDate.getDay()];
        dateTimeObject.day = `${dayOfWeek} ${dayOfMonth}${getDaySuffix(dayOfMonth)} ${month}`
    }
    return dateTimeObject
}

function getDaySuffix(day) {
    const lastDigit = day.length === 1 ? day : day[1];
    return lastDigit === "1" ? "st" : lastDigit === "2" ? "nd" : lastDigit === "3" ? "rd" : "th"
}

function getTimeSuffix(hour) {
    return hour < 12 ? "am" : "pm";
}

export function ViewRequests({requestsData, closeModal, showMessage, closeDialog}) {
    
    const requests = generateData(requestsData);
    
    return (
        <>
            <ModalSkeleton type="view-requests" closeModal={closeModal}>
                <div className="modal-display" style={{justifyContent: 'flex-start', width: 700 + 'px'}}>
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
                            </div>
                        )
                    })}
                </div>
            </ModalSkeleton>
        </>
        
    )
}