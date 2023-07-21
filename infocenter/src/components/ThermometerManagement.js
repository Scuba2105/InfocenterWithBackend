import useMediaQueries from "media-queries-in-react";

const formTypes = ["Repair Request Generation", "Check Thermometer Returns", "Thermometer Clean-Up"]

export function ThermometerManagement() {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    }); 

    return (
        <div className="thermometers-utility">
            {formTypes.map((type) => {
                return (
                    <form className={mediaQueries.laptop ? "thermometer-form-laptop" : "thermometer-form-desktop"}>
                        <h4>{type}</h4>
                    </form>
                )
            })}
        </div>
    );
}