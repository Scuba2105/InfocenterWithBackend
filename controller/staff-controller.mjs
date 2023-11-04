import { getAllStaffData, writeAllStaffData, updateStaffEntry, generateNewStaffData, addNewUserCredentials } from '../models/staff-models.mjs';
import bcrypt, { hash } from "bcrypt";
import { determineTeam } from '../utils/utils.mjs';
import { Mutex } from 'async-mutex';

// Use to prevent race conditions
const staffDataMutex = new Mutex();

// Define array of regex's to use for validation.
const inputsRegexLookup = {name: /^[a-z ,.'-]+$/i, id: /^[0-9]{8}$/i, workshop: /^[a-z ,.'-]+$/i,
                          position: /^[a-z ,.'-]+$/i, officePhone: /^[0-9]{8}$|^[0-9]{3}\s[0-9]{5}$|^[0-9]{5}$/,
                          dectPhone: /^[0-9]{5}$|^\s*$/, workMobile: /^0[0-9]{9}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}$|^\s*$/,
                          personalMobile: /^0[0-9]{9}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}$|^\s*$/,
                          hostname: /^[A-Z]{3}BME[0-9]{3}|^\s*$/, 
                          email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/};

export async function addNewStaffData(req, res, __dirname) {
    try {
        staffDataMutex.runExclusive(async () => {
            // Get the current device data 
            const staffData = await getAllStaffData(__dirname);
            
            // Validate the request body data
            for (const [key, value] of Object.entries(req.body)) {
                if (inputsRegexLookup[key].test(value));
            }

            // Define the mandatory data in the request body
            const name = req.body.name;
            const id = req.body.id;
            const workshop = req.body.workshop;
            const position = req.body.position;
            const officePhone = req.body.officePhone;
            const email = req.body.email;
            const team = determineTeam(position, workshop);

            // Generate a new staff data object
            const newStaffData = generateNewStaffData(name, id, workshop, position, officePhone, email, team)   

            // Add any optional data provided to the data object
            const optionalData = ["dectPhone", "workMobile", "personalMobile", "img"];
            
            // Loop over optional data and add to data object
            optionalData.forEach((entry) => {
                if (req.body[entry]) {
                    newStaffData[entry] = req.body[entry];
                }
            });

            // Append the new staff data 
            staffData.push(newStaffData);

            // Define hashing parameters and generate password hash
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(`InfoCentreUser${id}?`, saltRounds);

            // Create new entry in the Users table
            const addNewUser = await addNewUserCredentials(id, name, email, hashedPassword);

            // Write the data to file
            writeAllStaffData(__dirname, JSON.stringify(staffData, null, 2));

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'}); 
        })   
    } catch (err) {
        // Send the error response message.
        console.log(JSON.stringify({Route: "Add New Staff", Error: err.message}), null, 2);
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administrator`});
    }
}

export async function updateExistingStaffData(req, res, __dirname) {
    try {
        staffDataMutex.runExclusive(async () => {
            // Get the current device data 
            const staffData = await getAllStaffData(__dirname);
        
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
            writeAllStaffData(__dirname, JSON.stringify(updatedStaffData, null, 2));

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'}); 
        })
    } catch (err) {
        // Send the error response message.
        console.log(JSON.stringify({Route: `Update ${req.body["existing-id"]}`, Error: err.message}), null, 2);
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administrator`});
    }
    
}
