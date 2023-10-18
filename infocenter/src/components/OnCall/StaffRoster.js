import { staffOnCallRoster } from "../../utils/utils"

function getBackgroundColor(index) {
    if (index % 3 === 0 ) {
        return {backgroundColor: '#05A475'}
    }
    if (index % 3 === 1 ) {
        return {backgroundColor: '#fa854f'}
    }
    else {
        return {backgroundColor: '#b232d2'} 
    }
}

export function StaffRoster() {
    return (
        <div className="modal-display">
            {staffOnCallRoster.map((staff, index) => {
                return (
                    <div key={`$roster-entry-${index}`} className="staff-roster-label" style={getBackgroundColor(index)}>
                        <label>{`${index + 1}. ${staff}`}</label>
                    </div>
                )
            })}
        </div>
    )
}