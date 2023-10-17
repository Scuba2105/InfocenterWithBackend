export function StaffInfoEntry({heading, value, Icon, color, bColor}) {
    return (
        <div className="info-entry-container">
            <div className="info-entry flex-c" style={{backgroundColor: bColor}}>
                <Icon color={color}></Icon>
                <h4>{heading}</h4>
                <label>{value === "" ? "-" : value}</label>
            </div>
        </div>
    )
}
