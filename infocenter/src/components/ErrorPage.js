import { ComputerScreen, WarningIcon } from "../svg"

export function ErrorPage() {
    return (
        <div className="computer-container">
            <ComputerScreen size="400px" color="#C6CAED"></ComputerScreen>
            <div className="error-description">
                <WarningIcon size="80px" color="#ffffff"></WarningIcon>
                <h2>An unexpected error occurred</h2>
                <p>Please be patient while the issue is rectified and try again later</p>
            </div>
        </div>
    )
}