import { ComputerScreen, WarningIcon } from "../svg"
import { GearIcon } from "../svg"

export function ErrorPage() {
    return (
        <div className="computer-container">
            <div className="error-description">
                <h1 className="error-503">Error 503</h1>
                <p className="message1-503">Service currently unavailable.</p>
                <p className="message2-503">Please try again later.</p>
            </div>
            <ComputerScreen sizeX="400px" sizeY="500px" color="#C6CAED"></ComputerScreen>
            <GearIcon gearId="gear1" color="#F7A278" size="60px"></GearIcon>
            <GearIcon gearId="gear2" color="#F7A278" size="80px"></GearIcon>
            <GearIcon gearId="gear3" color="#F7A278" size="50px"></GearIcon>
        </div>
    )
}