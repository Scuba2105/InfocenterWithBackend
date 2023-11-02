import { getOnCallData, writeOnCallData } from "../models/on-call-models.mjs";
import { isValidDate } from "../utils/utils.mjs";

// This object is duplicated in the front end utilities and here in back end
export const staffOnCallRoster = ["Durga Sompalle", "Mitchell Pyne", "Atif Siddiqui",
"Mitchell Pacey", "Steven Bradbury", "Ray Aunei Mose", "Rodney Birt", "Kendo Wu", "Matthew Murrell"];

// Request object lookup
const objectPropLookup = {"originalOnCall": "Original Staff Member", "newOnCall":"New Staff Member",
 "reason": "Reason", "startDate": "Start Date", "endDate": "End Date"};

// List of reasons for On-Call roster changes for validation.
const rosterChangeReasons = ["Sickness", "Leave", "Family Reasons", "Unspecified Reasons"];

export async function updateOnCallData(req, res, __dirname) {
    const onCallData = await getOnCallData(__dirname);
    try {
        if (req.params.operation === "edit") {
            // Get the new data from the request and create the new date objects.
            const newData = req.body;
            const startDate = new Date(newData.startDate);
            const endDate = new Date(newData.endDate);
            const requestDateBoundaries = {startDate: startDate, endDate: endDate}
    
            // Validate the request object body.
            for (const [key, value] of Object.entries(newData)) {
                if (["originalOnCall", "newOnCall"].includes(key)) {
                    if (!staffOnCallRoster.includes(value)) {
                        throw new Error(`The input value for the ${objectPropLookup[key]} is not a valid staff member. Please fix this and try again`)
                    }
                }
                if (key === "reason") {
                    if (!rosterChangeReasons.includes(value)) {
                        throw new Error(`The input value for the ${objectPropLookup[key]} is not a valid reason. Please fix this and try again`)
                    }
                }
                if (["startDate", "endDate"].includes(key)) {
                    if (!isValidDate(requestDateBoundaries[key])) {
                        throw new Error(`The input value for the ${objectPropLookup[key]} is not a valid date. Please fix this and try again`)
                    }
                }
            }

            // Add the timestamps to the object.
            newData.startDate = startDate.getTime();
            newData.endDate = endDate.getTime();
            console.log(onCallData)
            // Add the new data to the existing on call data.
            onCallData.push(newData);
            console.log(onCallData)
            // Write the data to file.
            writeOnCallData(__dirname, JSON.stringify(onCallData, null, 2));
    
            // Send the response to the client.
            res.json({type: "Success", message: 'Data Upload Successful'});
        }
        else if (req.params.operation === "confirm") {
    
        }
    }
    catch (err) {
        // Send the error response message.
        console.log(JSON.stringify({Route: "Edit On-Call", Error: err.message}), null, 2);
        res.json({type: "Error", message: `An error occurred while updating the on-call data: ${err.message}`});
    }
}