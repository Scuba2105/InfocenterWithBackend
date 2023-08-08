import { ComputerScreen, WarningIcon } from "../svg"

export function ErrorPage() {
    return (
        <div className="computer-container">
            <ComputerScreen size="400px" color="#C6CAED"></ComputerScreen>
            <div className="error-description">
                <div className="warning-header">
                    <WarningIcon size="80px" color="#ffffff"></WarningIcon>
                </div>
                <h1>Error 503</h1>
                <p>Please be patient while the issue is rectified and try again later</p>
            </div>
        </div>
    )
}