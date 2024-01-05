import { serverConfig } from "../server"

export function RequestDetails({request}) {
    if (["Service Manual", "User Manual"].includes(request.requestType)) {
        return (
            <a className="request-file-link flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${request.filePath}`} download>
                <label className="request-file-path">{request.filePath.split("_").slice(-3).join("_")}</label>
            </a>
        )
    }
    else {
        return (
            <div>
            </div>
        )
    }
    
}