import { serverConfig } from "../server";
import { SoftwareIcon, PasswordsIcon } from "../svg";

export function RequestDetails({request}) {
    if (["Service Manual", "User Manual"].includes(request.requestType)) {
        return (
            <a className="request-file-link flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${request.filePath}`} download>
                <div className="request-file-container flex-c">
                    <img src={`https://${serverConfig.host}:${serverConfig.port}/images/pdf.png`} alt="copy" className="request-icon"></img>
                    <label className="request-file-path">{request.filePath.split("_").slice(-3).join("_")}</label>
                </div>
            </a>
        )
    }
    else if (["Configurations"].includes(request.requestType)) {
        const path = request.configPath;
        const hospital = request.hospital;
        const department = path.split("_")[4].replace(/-/g, " ").replace("--", " - ")
        const fileType = path.split(".").slice(-1)[0];
        return (
            <div className="request-file-link flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${request.filePath}`} download>
                <div className="request-file-container">
                    <img src={`https://${serverConfig.host}:${serverConfig.port}/images/cfg.png`} alt="copy" className="config-request-icon"></img>
                    <div className="config-request-location-container flex-c-col">
                        <div><label className="config-request-label">Hospital: </label><label className="config-request-hospital">{hospital}</label></div>
                        <div><label className="config-request-label">Department: </label><label className="config-request-department">{department}</label></div>
                        <div><label className="config-request-label">File Type: </label><label className="config-request-department">{fileType}</label></div>
                    </div>
                </div>
            </div>
        )
    }
    else if (["Software"].includes(request.requestType)) {

        const softwareType = request.softwareType === "device-software" ? "Device Software" : "Service Software" 

        return (
            <div className="request-file-link flex-c">
                <div className="request-software-container flex-c">
                    <SoftwareIcon color="#BCE7FD" size="50px"/>
                    <div className="software-request-location-container flex-c-col">
                            <div><label className="software-request-label">File Path: </label><label className="config-request-department">{request.softwareLocation}</label></div>
                            <div><label className="software-request-label">Type: </label><label className="config-request-hospital">{softwareType}</label></div>
                    </div>
                </div>
            </div>
        )
    }
    else if (["Documents"].includes(request.requestType)) {
        const extension = request.filePath.split(".").slice(-1)[0];
        const iconName = ["xls", "xlsx", "csv"].includes(extension) ? "xlsx" : ["docx", "doc"].includes(extension) ? "docx" : ["ppt", "pptx"].includes(extension) ? "pptx" : ["txt", "jpg", "png", "pdf"].includes(extension) ? extension : "document";
        return (
            <a className="request-file-link flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${request.filePath}`} download>
                <div className="request-software-container flex-c">
                    <img src={`https://${serverConfig.host}:${serverConfig.port}/images/${iconName}.png`} alt="copy" className="request-icon"></img>
                    <div className="config-request-location-container flex-c-col">
                            <div><label className="software-request-label">File Type: </label><label className="config-request-hospital">{extension}</label></div>
                            <div><label className="software-request-label">Title: </label><label className="config-request-department">{request.label}</label></div>
                    </div>
                </div>
            </a>
        )
    }
    else if (["Passwords"].includes(request.requestType)) {

        // Get restricted access type from the data 
        const passwordType = request.credentialType;
        const passwordData = request.passwordData.split(":"); 

        // Determine whether it is a username or password which is requested 
        const credentialType = passwordData[0];

        // Get the value of the username/password
        const credentialValue = passwordData[1].replace(/^\s/, "");

        return (
            <div className="request-file-link flex-c">
                <div className="request-software-container flex-c">
                    <PasswordsIcon color="#BCE7FD" size="50px"/>
                    <div className="software-request-location-container flex-c-col">
                        <div><label className="software-request-label">Access Type: </label><label className="config-request-department">{passwordType}</label></div>
                        <div><label className="software-request-label">Credential Type: </label><label className="config-request-department">{credentialType}</label></div>
                        <div><label className="software-request-label">Value: </label><label className="config-request-hospital">{credentialValue}</label></div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
            </div>
        )
    }
    
}