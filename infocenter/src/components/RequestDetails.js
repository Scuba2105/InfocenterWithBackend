import { serverConfig } from "../server"

export function RequestDetails({request}) {
    if (["Service Manual", "User Manual"].includes(request.requestType)) {
        return (
            <a className="request-file-link" href={`https://${serverConfig.host}:${serverConfig.port}${request.filePath}`} download>Download Link</a>
        )
    }
    else {
        return (
            <div>
            </div>
        )
    }
    
}