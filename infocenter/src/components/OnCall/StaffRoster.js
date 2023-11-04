import { staffOnCallRoster } from "../../utils/utils"

export function StaffRoster() {
    return (
        <div className="modal-display">
            {staffOnCallRoster.map((staff, index) => {
                const btnStyle = index % 2 === 0 ? "main-link-button" : "yellow-green-link-button";
                return (
                    <div key={`$roster-entry-${index}`} className={`staff-roster-label flex-c ${btnStyle}`}>
                        <label>{`${index + 1}. ${staff}`}</label>
                    </div>
                )
            })}
        </div>
    )
}