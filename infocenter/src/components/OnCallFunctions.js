import { EditRosterIcon, MyRosterIcon, StaffRosterIcon, KeyContactsIcon, CheatsheetIcon } from "../svg"

// Define the labels and icons for mapping the buttons.
const functionsData = [{label: "Edit Roster", "icon": EditRosterIcon, color: "#036d4d"}, 
{label: "My On-Call", "icon": MyRosterIcon, color: "#7E0320"}, 
{label: "Staff Roster", "icon": StaffRosterIcon, color: "#7E0320"}, 
{label: "Key Contacts", "icon": KeyContactsIcon, color: "#7E0320"}, 
{label: "On-Call Cheatsheet", "icon": CheatsheetIcon, color: "#7E0320"}];

export function OnCallFunctions() {

    return (
        <div className="on-call-functions-container">
            <div className="on-call-functions-header flex-c">On-Call Utilities</div>
            {functionsData.map((entry) => {
                return (
                    <div key={`${entry.label}-key`} className="on-call-function-container flex-c size-100">
                        <button className={`on-call-function-button flex-c ${entry.label.toLowerCase().replace(/\s/g, "-")}`}>
                            <entry.icon color={entry.color} size="35px"></entry.icon>
                            <div className="on-call-label-container flex-c">
                                <label className="on-call-label">{entry.label.split(" ")[0]}</label>
                                <label className="on-call-label">{entry.label.split(" ")[1]}</label>
                            </div>
                        </button>
                    </div>
                )
            })}
        </div>
    )
}