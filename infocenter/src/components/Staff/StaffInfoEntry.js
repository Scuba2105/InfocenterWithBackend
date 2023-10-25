export function StaffInfoEntry({heading, value, Icon, color, bColor}) {

    return (
        <div className="info-entry-container flex-c-col">
            <div className={`info-entry flex-c ${bColor}-link-button`}>
                <Icon color={color} size="6vh"></Icon>
                <label className="info-entry-label">{heading}</label>
                <label>{value === "" ? "N/A" : value}</label> 
            </div>
        </div>
    )
}
