import { determineTeam } from "../utils/utils.mjs";

const staffObjectPropLookup = {"name": "name", "id": "id", "hospital": "hospital", "position": "position", 
"office-phone": "officePhone", "dect-phone": "dectPhone", "work-mobile": "workMobile", 
"personal-mobile": "personalMobile", "extension": "img"};

export function updateStaffEntry(req, currentData) {
    for (const [key, value] of Object.entries(req.body)) {
    
        if (value !== currentData.id) {
            // Get the staff object property corresponding to the form data name.
            const prop = staffObjectPropLookup[key];

            if (prop !== undefined) {
                // Update the current data
                currentData[prop] = value;
            }
        }
    }

    // Update the team entry if required
    const position = currentData.position
    const workshop = currentData.hospital
    const team = determineTeam(position, workshop);
    if (team !== currentData.team) {
        currentData.team = team;
    }
        
    return currentData;
}