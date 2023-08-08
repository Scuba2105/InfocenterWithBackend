import { ComputerScreen, WarningIcon } from "../svg";
import { GearIcon } from "../svg";
import useMediaQueries from "media-queries-in-react";

export function ErrorPage() {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    return (
        <div className="computer-container">
            <div className={mediaQueries.laptop ? "error-description-laptop" : "error-description-desktop"}>
                <h1 className="error-503">Error 503</h1>
                <p className="message1-503">Service currently unavailable.</p>
                <p className="message2-503">Please try again later.</p>
            </div>
            <ComputerScreen sizeX="400px" sizeY="500px" color="#C6CAED"></ComputerScreen>
            <GearIcon gearId={mediaQueries.laptop ? "gear1-laptop" : "gear1-desktop"} color="#F7A278" size="60px"></GearIcon>
            <GearIcon gearId={mediaQueries.laptop ? "gear2-laptop" : "gear2-desktop"} color="#F7A278" size="80px"></GearIcon>
            <GearIcon gearId={mediaQueries.laptop ? "gear3-laptop" : "gear3-desktop"} color="#F7A278" size="50px"></GearIcon>
        </div>
    )
}