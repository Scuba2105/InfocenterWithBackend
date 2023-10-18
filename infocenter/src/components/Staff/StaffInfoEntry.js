export function StaffInfoEntry({heading, value, Icon, color, bColor}) {

    return (
        <div className="info-entry-container">
            <div className={`info-entry flex-c ${bColor}-background`}>
                <Icon color={color} size="7vh"></Icon>
                <label className="info-entry-value">{value === "" ? "N/A" : value}</label> 
            </div>
        </div>
    )
}
