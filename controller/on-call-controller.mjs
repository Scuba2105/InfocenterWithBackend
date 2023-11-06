import { getOnCallData, writeOnCallData, removeStaleEntries } from "../models/on-call-models.mjs";
import { isValidDate } from "../utils/utils.mjs";
import { Mutex } from "async-mutex";

// Use to prevent race conditions
const onCallDataMutex = new Mutex();

// This object is duplicated in the front end utilities and here in back end
export const staffOnCallRoster = ["Durga Sompalle", "Mitchell Pyne", "Atif Siddiqui",
"Mitchell Pacey", "Steven Bradbury", "Ray Aunei Mose", "Rodney Birt", "Kendo Wu", "Matthew Murrell"];

// Request object lookup
const objectPropLookup = {"originalOnCall": "Original Staff Member", "newOnCall":"New Staff Member",
 "reason": "Reason", "startDate": "Start Date", "endDate": "End Date"};

// List of reasons for On-Call roster changes for validation.
const rosterChangeReasons = ["Sickness", "Leave", "Family Reasons", "Unspecified Reasons"];

export async function updateOnCallData(req, res, __dirname) {

    const existingonCallData = await getOnCallData(__dirname);

    // Remove any existing oncall entries 4 weeks before current date
    const onCallData = removeStaleEntries(existingonCallData, 4);
    
    // Run this function exclusively to prevent race conditions.
    onCallDataMutex.runExclusive(async () => {
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
                
                // Add the new data to the existing on call data.
                onCallData.rosterEdits.push(newData);
                
                // Write the data to file.
                writeOnCallData(__dirname, JSON.stringify(onCallData, null, 2));
        
                // Send the response to the client.
                res.json({type: "Success", message: 'Data Upload Successful'});
            }
            else if (req.params.operation === "confirm") {
                // Get the confirmation data from the request and create the new date objects.
                const newData = req.body;
                const startDate = new Date(newData.startDate);
                const endDate = new Date(newData.endDate);

                // Use Date range array with both start and end dates to validate date objects
                const dateRange = [startDate, endDate];
                for (const [index, value] of dateRange.entries()) {
                    if (!isValidDate(value)) {
                        throw new Error(`The input value for the ${objectPropLookup[key]} is not a valid date. Please fix this and try again`)
                    }
                } 

                // Validate the start and end date are correct days of the week. Also make sure they are date objects.
                const numericStartDay = startDate.getDay();
                if (numericStartDay !== 1) {
                    throw new Error("The Start Date of the confirmation window is not a Monday. Please correct this and try again");
                }
                const numericEndDay = endDate.getDay();
                if (numericEndDay !== 0) {
                    throw new Error("The End Date of the confirmation window is not a Sunday. Please correct this and try again");
                }

                // Add the timestamps to the object.
                newData.startDate = startDate.getTime();
                newData.endDate = endDate.getTime();
                
                // Add the new confirmation data to the existing on call data.
                onCallData.rosterConfirmation.push(newData);
                
                // Write the data to file.
                writeOnCallData(__dirname, JSON.stringify(onCallData, null, 2));
        
                // Send the response to the client.
                res.json({type: "Success", message: 'Data Upload Successful'});
            }        
        }
        catch (err) {
            // Send the error response message.
            console.log({Route: "Edit On-Call", Error: err.message});
            res.json({type: "Error", message: `An error occurred while updating the on-call data. ${err.message}`});
        }
    })
}