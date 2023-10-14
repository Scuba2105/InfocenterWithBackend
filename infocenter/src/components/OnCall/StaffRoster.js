import { staffOnCallRoster } from "../../utils/utils"

export function StaffRoster() {
    return (
        <div className="modal-display">
            {staffOnCallRoster.map((staff) => {
                return (
                    <>
                        <label>{staff}</label>
                    </>
                )
            })}
        </div>
    )
}