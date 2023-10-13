import { EditRosterIcon, MyRosterIcon, StaffRosterIcon, KeyContactsIcon, CheatsheetIcon } from "../svg"

// Define the labels and icons for mapping the buttons.
const functionsData = [{label: "Edit Roster", "icon": EditRosterIcon}, {label: "My On-Call", "icon": MyRosterIcon},
{label: "Staff Roster", "icon": StaffRosterIcon}, {label: "Key Contacts", "icon": KeyContactsIcon}, 
{label: "On-Call Cheatsheet", "icon": CheatsheetIcon}];

export function OnCallFunctions() {

    return (
        <div className="on-call-functions-container size-100">
            {functionsData.map((entry) => {
                return (
                    <div key={`${entry.label}-key`} className="on-call-function-container flex-c size-100">
                        <button className={`on-call-function-button flex-c ${entry.label.toLowerCase().replace(/\s/g, "-")}`}>
                            <entry.icon color="#ffffff" size="35px"></entry.icon>
                            <label className="on-call-label">{entry.label}</label>
                        </button>
                    </div>
                )
            })}
        </div>
    )
}