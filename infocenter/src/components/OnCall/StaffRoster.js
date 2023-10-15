import { staffOnCallRoster } from "../../utils/utils"

function getBackgroundColor(index) {
    if (index % 4 === 0 ) {
        return {backgroundColor: '#3972e4'}
    }
    else if (index % 4 === 1 ) {
        return {backgroundColor: '#f13a65'}
    }
    else if (index % 4 === 2 ) {
        return {backgroundColor: '#06BF88'}
    }
    else {
        return {backgroundColor: '#f07b45'}
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