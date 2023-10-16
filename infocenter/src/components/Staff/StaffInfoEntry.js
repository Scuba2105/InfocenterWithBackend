import { OnCallIcon } from "../../svg"

export function StaffInfoEntry({heading, dataProps, selectedData}) {
    return (
        <div className="info-entry-container">
            <div className="info-entry flex-c">
                <OnCallIcon color="yellow"></OnCallIcon>
                <h4>{heading}</h4>
                {dataProps.map((entry) => {
                    return (
                        <>
                            <label>{`${entry}: ${selectedData[entry] === "" ? "-" : selectedData[entry]}`}</label>
                        </>
                    ) 
                })}
            </div>
        </div>
    )
}
