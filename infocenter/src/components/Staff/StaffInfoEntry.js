export function StaffInfoEntry({heading, value, Icon, color, bColor}) {
    return (
        <div className="info-entry-container">
            <div className={`info-entry flex-c ${bColor}-background`} style={{color: color}}>
                <Icon color={color}></Icon>
                <h4>{heading}</h4>
                <label className="info-entry-value">{value === "" ? "-" : value}</label>
            </div>
        </div>
    )
}
