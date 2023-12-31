export function StaffInfoEntry({heading, value, Icon, color, bColor}) {
    
    const valueArray = value.split(" ");
    
    return (
        <div className="info-entry-container flex-c-col">
            <div className={`info-entry flex-c ${bColor}-link-button inactive`}>
                <Icon color={color} size="6vh"></Icon>
                <label className="info-entry-label">{heading}</label>
                {heading === "Computer" ? 
                <div className="flex-c-col">
                    {valueArray.map((entry,index) => {
                        return (
                            <label key={`info-entry-label${index}`}>{entry === "" ? "N/A" : entry}</label> 
                        )
                    })}
                </div> :
                <label>{value === "" ? "N/A" : value}</label>}
            </div>
        </div>
    )
}
