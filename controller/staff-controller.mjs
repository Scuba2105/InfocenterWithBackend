import {readStaffData, writeStaffData, generateNewStaffData, determineTeam } from '../utils/utils.mjs';
import { updateStaffEntry } from '../models/models.mjs';
import { Mutex } from 'async-mutex';

// Use to prevent race conditions
const staffDataMutex = new Mutex();

export async function addNewStaffData(req, res, __dirname) {
    try {
        staffDataMutex.runExclusive(async () => {
            // Get the current device data 
            const staffData = await readStaffData(__dirname);
            
            // Define the mandatory data in the request body
            const name = req.body.name;
            const id = req.body.id;
            const workshop = req.body.workshop;
            const position = req.body.position;
            const officePhone = req.body["office-phone"];
            const team = determineTeam(position, workshop);

            // Generate a new staff data object
            const newStaffData = generateNewStaffData(name, id, workshop, position, officePhone, team)   

            // Add any optional data provided to the data object
            const optionalData = {"dect-phone": "dectPhone", "work-mobile": "workMobile", "personal-mobile": "personalMobile",
            "extension": "img"};
            
            // Loop over optional data and add to data object
            Object.keys(optionalData).forEach((key) => {
                if (req.body[key]) {
                    newStaffData[optionalData[key]] = req.body[key];
                }
            });

            // Append the new staff data 
            staffData.push(newStaffData);

            // Write the data to file
            writeStaffData(__dirname, JSON.stringify(staffData, null, 2));

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'}); 
        })   
    } catch (err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administrator`});
    }
}

export async function updateExistingStaffData(req, res, __dirname) {
    try {
        staffDataMutex.runExclusive(async () => {
            // Get the current device data 
            const staffData = await readStaffData(__dirname);
        
            // Get the staff ID and find the existing employee data
            const existingId = req.body["existing-id"];
            const currentData = staffData.find((entry) => {
                return entry.id === existingId;
            });
                    
            // Update the data based on the key value pairs in the request body.
            const updatedEntry = updateStaffEntry(req, currentData);

            // Add the new entry to the staff array
            const updatedStaffData = staffData.map((entry) => {
                if (entry.id === existingId) {
                    return updatedEntry;
                }
                return entry;
            })

            // Write the data to file
            writeStaffData(__dirname, JSON.stringify(updatedStaffData, null, 2));

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'}); 
        })
    } catch (err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administrator`});
    }
    
}
