import { serverConfig } from "../server";
import { SoftwareIcon } from "../svg";

export function RequestDetails({request}) {
    if (["Service Manual", "User Manual"].includes(request.requestType)) {
        return (
            <a className="request-file-link flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${request.filePath}`} download>
                <div className="request-file-container flex-c">
                    <img src={`https://${serverConfig.host}:${serverConfig.port}/images/pdf.png`} alt="copy" className="document-icon"></img>
                    <label className="request-file-path">{request.filePath.split("_").slice(-3).join("_")}</label>
                </div>
            </a>
        )
    }
    else if (["Configurations"].includes(request.requestType)) {
        const path = request.configPath;
        const hospital = request.hospital;
        const department = path.split("_")[4].replace("--", "-")
        const fileType = path.split(".").slice(-1)[0];
        return (
            <a className="request-file-link flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${request.filePath}`} download>
                <div className="request-file-container flex-c">
                    <img src={`https://${serverConfig.host}:${serverConfig.port}/images/cfg.png`} alt="copy" className="document-icon"></img>
                    <div className="config-request-location-container flex-c-col">
                        <div><label className="config-request-label">Hospital: </label><label className="config-request-hospital">{hospital}</label></div>
                        <div><label className="config-request-label">Department: </label><label className="config-request-department">{department}</label></div>
                        <div><label className="config-request-label">File Type: </label><label className="config-request-department">{fileType}</label></div>
                    </div>
                </div>
            </a>
        )
    }
    else if (["Software"].includes(request.requestType)) {

        const softwareType = request.softwareType === "device-software" ? "Device Software" : "Service Software" 

        return (
            <div className="request-file-link flex-c">
                <div className="request-software-container flex-c">
                    <SoftwareIcon color="white" size="50px"/>
                    <div className="software-request-location-container flex-c-col">
                            <div><label className="software-request-label">Type: </label><label className="config-request-hospital">{softwareType}</label></div>
                            <div><label className="software-request-label">File Path: </label><label className="config-request-department">{request.softwareLocation}</label></div>
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